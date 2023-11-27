describe('app banner specs', () => {

    beforeEach(() => {
        cy.registerUser("autotest4", "autotest4", "11223344&&", "11223344&&")
        cy.signInUser("autotest4", "11223344&&")
    })
  
    it('should have /browsepage in the url', () => {
      cy.url().should('include', '/browsepage')
    })
  
    it("marketplace button routes to browse page", () => {
        cy.get("#settingsDropdown").click()
        cy.get("#settingsDropdownOption").first().click()
        cy.get("#marketplaceBtn").click()
        cy.url().should('include', '/browsepage')
    })

    it("logout button routes to login page", () => {
        cy.get("#settingsDropdown").click()
        cy.get("#settingsDropdownOption").first().click()
        cy.get("#logoutBtn").click()
        cy.url().should('include', '/login')
    })

    it("account settings button routes to profile page", () => {
        cy.get("#settingsDropdown").click()
        cy.get("#settingsDropdownOption").first().click()
        cy.url().should('include', '/profile')
    })

    it("logo button routes to browse page", () => {
        cy.get("#settingsDropdown").click()
        cy.get("#settingsDropdownOption").first().click()
        cy.get("#logoBtn").click()
        cy.url().should('include', '/browsepage')
    })
  })
  