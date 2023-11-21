describe('marketplace specs', () => {
  Cypress.Commands.add('login', (email, password) => {
    cy.session([email, password], () => {
      cy.visit("localhost:3000")
      cy.get('#email').type(email)
      cy.get('#password').type(password)
      cy.get("#signInBtn").click()
    })
  })
  beforeEach(() => {
    cy.login("autotest", "11223344!!")
    cy.get("#marketplaceBtn").click()
  })

    it("sort by recent button displays correctly", () => {
        cy.get("#outerSortByMenuBtn").click()
        cy.get("#recentSortSelect").should("have.text", "recent").click()
    })

    it("sort by name button displays correctly", () => {
        cy.get("#outerSortByMenuBtn").click()
        cy.get("#nameSortSelect")
            .should("have.text", "Alphabetical Order")
            .click()
    })

    it("map info displays correctly", () => {
        cy.get("#createdByUser").should("have.text", "CREATED BY USER")
    })

    it("by username/mapName info displays correctly", () => {
        cy.get("#outerMenuByName").click()
        cy.get("#byUsernameBtn").should("have.text", "Username").click()
    })

    it("by username/mapName info displays correctly", () => {
        cy.get("#outerMenuByName").click()
        cy.get("#byMapNameBtn").should("have.text", "Map Name").click()
    })
})
