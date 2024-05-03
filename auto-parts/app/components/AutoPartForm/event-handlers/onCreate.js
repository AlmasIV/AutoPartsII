"use client";

import { autoPartConfigs } from "../../configurations/configs.js";

export default async function onCreate(event){
    event.preventDefault();
    const autoPart = {};
    let prop;
    const formElements = event.target.elements;
    for(let autoPartConfig of autoPartConfigs){
        if(formElements[autoPartConfig.name]){
            if(autoPartConfig.type === "number"){
                prop = Number(formElements[autoPartConfig.name].value);
            }
            else{
                prop = formElements[autoPartConfig.name].value;
            }
            autoPart[autoPartConfig.name] = prop;
        }
    }

    event.target.reset();

    return (await submitAutoPart(autoPart));
}

async function submitAutoPart(autoPart){
    const result = await fetch("https://localhost:7019/auto-parts/create", {
        method: "POST",
        cache: "no-cache",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(autoPart)
    });

    if(result.ok){
        return true;
    }
    
    return false;
}