describe("map viewing specs", () => {
    before(() => {
        cy.signInUser("autotest5", "11223344&&")
        cy.get("#createMapOuterBtn").click()
        cy.get("#mapTitleBox").type("testing")
        cy.get("#template-select").parent().click()
        cy.get("#heatmapOption").click()
        cy.get("#createMapBtnFromMyMaps")
        .should("have.text", "Create")
        .click();
    })

    beforeEach(() => {
        cy.signInUser("autotest5", "11223344&&")
        cy.get("#mapImage").first().click()
    })

    it("export map button", () => {
        cy.visit("localhost:3000")
        cy.contains("button", "Export").click()
        cy.get("#exportMapModalText").should(
            "have.text",
            "Select the format you would like to export as:"
        )
        cy.get("#exportBtnOnModal").should("have.text", "Export").click()
    })
    it('publish map button', () => {
        cy.visit("localhost:3000")
        cy.contains('button', 'Publish')
        .click()
        cy.get("#publishBtnOnModal")
        .should("have.text", "PUBLISH")
        .click();
    })
    it("add field map button", () => {
        cy.visit("localhost:3000")
        cy.get("#addFieldBtn").click()
        cy.get("#add-field-modal-title").should("have.text", "Add Field")
    })
    it("add comment button", () => {
        cy.get("#commentTab").click()
        cy.get("#addCommentBtn").click()
        cy.get("#comment-modal-title").should("have.text", "Comment")
    })
    it("ensure redo on screen", () => {
        cy.get("#redoBtn").click()
    })
    it("ensure undo on screen", () => {
        cy.get("#undoBtn").click()
    })
    it('ensure zoom in on screen', () => {
        cy.get("#zoomInBtn")
        .click()
    })
    it('ensure zoom out on screen', () => {
        cy.get("#zoomOutBtn")
        .click()
    })
    it('ensure like btn works', () => {
        cy.get("#likeBtn")
        .click()
        cy.get("#numLikes")
        .should("have.text", "1")
    })
    it("ensure dislike btn works", () => {
        cy.get("#dislikeBtn").click()
        cy.get("#numDislikes").should("have.text", "1")
    })
})
