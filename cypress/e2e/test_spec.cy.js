describe('example to-do app', () => {
  beforeEach(() => {
    cy.visit('129.213.145.105')
  })
  it('displays the words API Tester', () => {
      cy.get('h1').first().should('have.text', "API Tester")})

  it('checks first radio button', () => {
      cy.get('[type=radio]').first().check()})
})  