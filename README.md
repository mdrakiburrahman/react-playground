# React Playground


<!-- TOC depthfrom:2 -->

- [React Playground](#react-playground)
  - [React Budget App](#react-budget-app)
  - [Fluent UI (Typescript)](#fluent-ui-typescript)

<!-- /TOC -->

A hodge podge of demo projects to figure things out quickly in React and reference it later.

## React Budget App

```powershell

npx --version
# 10.2.4

# Create demo project
npx create-react-app budget-tracker

cd .\budget-tracker\

# Package: CSS without creating our own style sheets
npm i bootstrap

# Package: Generates UUID
npm i uuid

# Package: Create icons
npm i react-icons

# Start the server
npm start
```

## Fluent UI (Typescript)

```powershell
npx create-react-app fluent-playground --template typescript

cd .\fluent-playground\

npm install @fluentui/react-components
npm install @fluentui/example-data
npm install @fluentui/react
npm install @fluentui/react-hooks

npm start
```