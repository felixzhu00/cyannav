describe('map viewing specs', () => {
    beforeEach(() => {
      cy.visit('129.213.145.105')
      cy.get("#signInBtn").click()
      cy.get('#mapImage')
      .first()
      .click();
    })

    it('export map button', () => {
        cy.contains('button', 'Export')
        .click()
        cy.get("#exportMapModalText")
        .should("have.text", "Select the format you would like to export as:")
        cy.get("#exportBtnOnModal")
        .should("have.text", "Export")
        .click();
    })
    it('publish map button', () => {
        cy.contains('button', 'Publish')
        .click()
        cy.get("#publishBtnOnModal")
        .should("have.text", "PUBLISH")
        .click();
    })
    it('add field map button', () => {
        cy.get('#addFieldBtn')
        .click()
        cy.get("#add-field-modal-title")
        .should("have.text", "Add Field")
    })
    it('add comment button', () => {
        cy.get("#commentTab")
        .click()
        cy.get('#addCommentBtn')
        .click()
        cy.get("#comment-modal-title")
        .should("have.text", "Comment")
    })
    it('ensure redo on screen', () => {
        cy.get("#redoBtn")
        .click()
    })
    it('ensure undo on screen', () => {
        cy.get("#undoBtn")
        .click()
    })
    // it('ensure zoom in on screen', () => {
    //     cy.get("#zoomInBtn")
    //     .click()
    // })
    // it('ensure zoom out on screen', () => {
    //     cy.get("#zoomOutBtn")
    //     .click()
    // })
    it('ensure like btn works', () => {
        cy.get("#likeBtn")
        .click()
        cy.get("#numLikes")
        .should("have.text", "1")
    })
    it('ensure dislike btn works', () => {
        cy.get("#dislikeBtn")
        .click()
        cy.get("#numDislikes")
        .should("have.text", "1")
    })
  })
  