describe('login page specs', () => {
    beforeEach(() => {
      cy.visit('129.213.145.105')
    })
  
    it('checks that email is displayed', () => {
        cy.get('#email')
        .should('have.attr', 'name', 'email');
    })
    it('checks that password is displayed', () => {
      cy.get('#password')
      .should('have.attr', 'name', 'password');
  })
})