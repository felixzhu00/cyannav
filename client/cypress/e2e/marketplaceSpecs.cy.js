describe('marketplace specs', () => {
      
  beforeEach(() => {
    cy.signInUser("autotest55", "12345678&&")
    cy.get("#marketplaceBtn").click()
  })

  it('should have /browsepage in the url', () => {
    cy.url().should('include', '/browsepage')
})

    it("sort by recent button displays correctly", () => {
        cy.get("#outerSortByMenuBtn").click()
        cy.get("#recentSortSelect").should("have.text", "Recently Created").click()
    })

    it("sort by name button displays correctly", () => {
        cy.get("#outerSortByMenuBtn").click()
        cy.get("#nameSortSelect")
            .should("have.text", "Alphabetical Order")
            .click()
    })

    // it("map info displays correctly", () => {
    //     cy.get("#createdByUser").should("have.text", "By (OWNER)")
    // })

    it("by username/mapName info displays correctly", () => {
        cy.get("#outerMenuByName").click()
        cy.get("#byUsernameBtn").should("have.text", "Username").click()
    })

    it("by username/mapName info displays correctly", () => {
        cy.get("#outerMenuByName").click()
        cy.get("#byMapNameBtn").should("have.text", "Map Name").click()
    })
})
