sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/model/json/JSONModel",
  "sap/m/MessageToast",
  "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, MessageBox) {
  "use strict";

  const SERVICE = "/monitoring/srv-api/odata/v4/mobi-monitoring";

  return Controller.extend("monitoring.controller.Main", {
    onInit: function () {
      this.getView().setModel(new JSONModel({
        summary: {}, files: [], consolidations: [], audits: []
      }));
      this._load();
    },

    onRefresh: function () {
      this._load();
    },

    statusState: function (value) {
      const v = String(value || "").toUpperCase();
      if (v === "FAILED" || v === "062" || v === "E") return "Error";
      if (v === "PROCESSING" || v === "060" || v === "W") return "Warning";
      if (v === "COMPLETED" || v === "061" || v === "S") return "Success";
      return "None";
    },

    httpState: function (value) {
      const n = Number(value || 0);
      if (n >= 400) return "Error";
      if (n >= 200) return "Success";
      return "None";
    },

    messageState: function (value) {
      return this.statusState(value);
    },

    _load: async function () {
      const view = this.getView();
      view.setBusy(true);
      try {
        const summary = await this._get("/getSummary()");
        const [files, consolidations, audits] = await Promise.all([
          this._get("/FileLogs?$top=30&$orderby=CREATED_TIMESTAMP%20desc"),
          this._get("/ConsolidationHeaders?$top=30&$orderby=CREATED_TIMESTAMP%20desc"),
          this._get("/Audit?$top=50&$orderby=CREATED_TIMESTAMP%20desc")
        ]);
        view.getModel().setData({
          summary: summary.value || summary,
          files: files.value || [],
          consolidations: consolidations.value || [],
          audits: audits.value || []
        });
        MessageToast.show("Monitoring data refreshed");
      } catch (error) {
        MessageBox.error("Monitoring data could not be loaded. " + (error?.message || String(error)));
      } finally {
        view.setBusy(false);
      }
    },

    _get: async function (path) {
      const response = await fetch(SERVICE + path, {
        method: "GET",
        headers: { "Accept": "application/json" },
        credentials: "same-origin"
      });
      if (!response.ok) {
        const body = await response.text();
        throw new Error(response.status + " " + response.statusText + (body ? ": " + body.slice(0, 300) : ""));
      }
      return response.json();
    }
  });
});
