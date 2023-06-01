// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { MessageFactory, InputHints } = require('botbuilder');
const { ComponentDialog, DialogSet, DialogTurnStatus, TextPrompt, WaterfallDialog } = require('botbuilder-dialogs');

const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog';

class MainDialog extends ComponentDialog {

    constructor(beverageDialog, foodDialog, intentDialog) {
        super('MainDialog');

        // Define the main dialog and its related components.
        this.addDialog(new TextPrompt('TextPrompt'))
            .addDialog(intentDialog)
            .addDialog(beverageDialog)
            .addDialog(foodDialog)
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
                this.intentStep.bind(this),
                this.mainStep.bind(this),
                this.finalStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }

    /**
     * The run method handles the incoming activity (in the form of a TurnContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} turnContext
     * @param {*} accessor
     */
    async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();

        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    async intentStep(stepContext) {
        const intentDetails = {};
        return await stepContext.beginDialog('intentDialog', intentDetails)
    }

    async mainStep(stepContext) {
        const intentDetails = stepContext.options;
        intentDetails.intent = stepContext.result
        switch(intentDetails.intent.intent) {
            case "food":
                return await stepContext.beginDialog('foodDialog', intentDetails)
            case "beverage":
                return await stepContext.beginDialog('beverageDialog', intentDetails)
            default:
                console.log(JSON.stringify(intentDetails))
        }
        return await stepContext.next();
    }

    async beverageStep(stepContext) {
        const beverageDetails = {};
        return await stepContext.beginDialog('beverageDialog', beverageDetails)
    }

    async finalStep(stepContext) {
        // If the child dialog ("bookingDialog") was cancelled or the user failed to confirm, the Result here will be null.
        if (stepContext.result) {
            const result = stepContext.result;
            const msg = `I have chosen ${ JSON.stringify(result) }`;
            await stepContext.context.sendActivity(msg, msg, InputHints.IgnoringInput);
        }

        // Restart the main dialog with a different message the second time around
        return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: 'What else can I do for you?' });
    }
}

module.exports.MainDialog = MainDialog;
