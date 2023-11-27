describe("my maps specs", () => {
    beforeEach(() => {
      cy.registerUser("autotest@hi.com", "autotest", "11223344!!", "11223344!!")
    })

    it('should have /browsepage in the url', () => {
      cy.url().should('include', '/browsepage')
  })
    // it('import map button ', () => {
    //     cy.get("#createMapOuterBtn")
    //     .click()
    //     cy.get("#createMapBtnFromMyMaps")
    //     .should("have.text", "Create")
    //     .click();
    //   })

    // it('map info button displays correct dropdown options', () => {
    //     cy.get("#moreInfoMapIcon")
    //     .click()
    //     cy.get("#renameOption")
    //     .should("have.text", "Rename")
    //     cy.get("#addTagOption")
    //     .should("have.text", "Add Tag")
    //     cy.get("#publishOption")
    //     .should("have.text", "Publish")
    //     cy.get("#duplicateOption")
    //     .should("have.text", "Duplicate")
    //     cy.get("#deleteOption")
    //     .should("have.text", "Delete")
    //   })
  
    it('sort by recent button displays correctly', () => {
      cy.get("#outerSortByMenuBtn")
      .click()
      cy.get("#recentSortSelect")
      .should("have.text", "Recent")
      .click();
    })
  
    it('sort by name button displays correctly', () => {
      cy.get("#outerSortByMenuBtn")
      .click()
      cy.get("#nameSortSelect")
      .should("have.text", "Alphabetical Order")
      .click();
    })
  
    // it('map info displays correctly', () => {
    //   cy.get("#createdByUser")
    //   .should("have.text", "CREATED BY USER")
    // })
  
    it('by username/mapName info displays correctly', () => {
      cy.get("#outerMenuByName")
      .click()
      cy.get("#byUsernameBtn")
      .should("have.text", "Username")
      .click()
    })
  
    it('by username/mapName info displays correctly', () => {
      cy.get("#outerMenuByName")
      .click()
      cy.get("#byMapNameBtn")
      .should("have.text", "Map Name")
      .click()
    })
})
