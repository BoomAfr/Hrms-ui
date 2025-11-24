import API from "../api";

export const taxRuleAPI = {
  getAll: () => API.get("/company/setup/tax-rules/"),
  updateAll: (rules) =>
    API.put("/company/setup/tax-rules/", { rules }),
};
