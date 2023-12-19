describe('forgotPassword specs', () => {
      
    beforeEach(() => {
        cy.visit("localhost:3000")    
        cy.get("#forgotPassLink").click()
    })
  
    it('should have /forget in the url', () => {
      cy.url().should('include', '/forget')
    })

    it('email box should have name attribute = email', () => {
        cy.get("#email").should("have.attr", "name", "email")
    })
})