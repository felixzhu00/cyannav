describe("app banner specs", () => {
    before(() => {
        cy.registerUser("autotest13", "autotest13", "11223344&&", "11223344&&")
        cy.wait(2000)
    })

    beforeEach(() => {
        cy.visit("")
    })

    it("should have /browsepage in the url", () => {
        cy.visit("129.213.145.105")
        cy.url().should("include", "/browsepage")
    })

    it("marketplace button routes to browse page", () => {
        cy.signInUser("autotest13", "11223344&&")
        cy.get("#settingsDropdown").click()
        cy.get("#settingsDropdownOption").first().click()
        cy.get("#marketplaceBtn").click()
        cy.url().should("include", "/browsepage")
    })

    it("logout button routes to login page", () => {
        cy.signInUser("autotest10", "11223344&&")
        cy.get("#settingsDropdown").click()
        cy.get("#settingsDropdownOption").first().click()
        cy.get("#logoutBtn").click()
        cy.url().should("include", "/login")
    })

    it("account settings button routes to profile page", () => {
        cy.signInUser("autotest10", "11223344&&")
        cy.get("#settingsDropdown").click()
        cy.get("#settingsDropdownOption").first().click()
        cy.url().should("include", "/profile")
    })

    it("logo button routes to browse page", () => {
        cy.signInUser("autotest10", "11223344&&")
        cy.get("#settingsDropdown").click()
        cy.get("#settingsDropdownOption").first().click()
        cy.get("#logoBtn").click()
        cy.url().should("include", "/browsepage")
    })
})
