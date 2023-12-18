describe("login page specs", () => {
    beforeEach(() => {
        cy.visit("localhost:3000")    
    })

    it("ensures error message is displayed when bad info is entered", () => {
        cy.get("#email").type("hi")
        cy.get("#password").type("yes")
        cy.get("#signInBtn").click()
        cy.get("#errMsg1").should("have.text", "Wrong email or password")
    })

    it("checks that email is displayed", () => {
        cy.get("#email").should("have.attr", "name", "email")
    })
    it("checks that password is displayed", () => {
        cy.get("#password").should("have.attr", "name", "password")
    })
})
