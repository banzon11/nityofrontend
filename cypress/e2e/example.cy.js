describe("Example Test", () => {
  it("should visit the app", () => {
    cy.visit("/");
    cy.contains("Duties").should("exist");
  });
});
