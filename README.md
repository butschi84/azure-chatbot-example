# Azure Chatbot Blog Series

Github Repository / Code for the Opensight.ch Blog Series "Journey to an intelligent Azure Chat Bot"

# Content

* [Key Information](#key-information)
* [Downloads](#downloads)
* [Notes](#notes)
  
# Key Information
|Description   |Link       |
|--------------|-----------|
|opensight.ch website | [opensight.ch](opensight.ch) |
| Azure Bot Blog Series Part 1 - Services Deployment | [link](https://blog.opensight.ch/azure-chat-bot/) |


# Downloads
## Bot Emulator

https://github.com/Microsoft/BotFramework-Emulator/releases/tag/v4.14.1

Address: http://localhost:3978/api/messages

# Notes

## deployment info notepad
```
{
  "appId": "********-****-****-****-************",
  "password": "******************",
  "tenant": "********-****-****-****-************"
}
```

# azure resources deployment
```
az deployment group create --resource-group bot --template-file $PROJECTROOT/deploymentTemplates/deployUseExistResourceGroup/template-BotApp-with-rg.json --parameters "$PROJECTROOT/deploymentTemplates/deployUseExistResourceGroup/parameters-for-template-BotApp-with-rg.json"

az deployment group create --resource-group bot --template-file $PROJECTROOT/deploymentTemplates/deployUseExistResourceGroup/template-AzureBot-with-rg.json --parameters "$PROJECTROOT/deploymentTemplates/deployUseExistResourceGroup/parameters-for-template-AzureBot-with-rg.json"
```
