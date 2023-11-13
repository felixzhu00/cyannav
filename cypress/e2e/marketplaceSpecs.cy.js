describe('marketplace specs', () => {
  beforeEach(() => {
    cy.visit('129.213.145.105')
    cy.get("#signInBtn").click()
    cy.get("#marketplaceBtn").click()
  })

  it('sort by recent button displays correctly', () => {
    cy.get("#recentSortSelect")
    .should("have.text", "Recent")
    .click();
  })

  it('sort by name button displays correctly', () => {
    cy.get("#nameSortSelect")
    .should("have.text", "Name")
    .click();
  })

  it('map info displays correctly', () => {
    cy.get("#createdByUser")
    .should("have.text", "CREATED BY USER")
  })

  it('by username/mapName info displays correctly', () => {
    cy.get("#byUsernameBtn")
    .should("have.text", "BY USERNAME")
    .click()
  })

  it('by username/mapName info displays correctly', () => {
    cy.get("#byMapNameBtn")
    .should("have.text", "BY MAP NAME")
    .click()
  })

})