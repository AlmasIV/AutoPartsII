// import autoPartConfigs from "@/configurations/auto-part-configuration.json";
import generateGUID from "@/utils/GUID/GUID.js";

export default async function onCreate(event, globalNotification, autoPartsState) {
    //const autoPart = parseAutoPartFromForm(event);
    const formData = new FormData(event.target);
    // console.log("FORMDATA LOGGING:");
    // for(let [key, value] of formData.entries()) {
    //     if(value instanceof File) {
    //         console.log(`File field: ${key}, Filename: ${value.name}, Size: ${value.size}, Type: ${value.type}`);
    //     } else {
    //         console.log(`Field: ${key}, Value: ${value}`);
    //     }
    // }
    await submitAutoPart(formData, globalNotification, autoPartsState);
}

async function submitAutoPart(formData, globalNotification, autoPartsState) {
    try {
        const result = await fetch("/api/authenticated/auto-parts/create", {
            method: "POST",
            cache: "no-cache",
            // headers: {
            //     "Content-Type": "application/json"
            // },
            body: formData
        });
        if(result.redirected) {
            window.location.href = result.url;
            return;
        }
        const response = await result.json();
        if(result.ok) {
            globalNotification.setNotifications(
                [
                    {
                        message: response.message,
                        level: "success",
                        key: generateGUID()
                    },
                    ...globalNotification.notifications
                ]
            );
            if(autoPartsState.autoParts.length < 99) {
                autoPartsState.setAutoParts(
                    [
                        ...autoPartsState.autoParts,
                        response.data
                    ]
                );
            }
            autoPartsState.setTotalAutoParts(total => total + 1);
        }
        else {
            globalNotification.setNotifications(
                [
                    {
                        message: response.message,
                        level: "danger",
                        key: generateGUID()
                    },
                    ...globalNotification.notifications
                ]
            );
        }
    }
    catch(error) {
        globalNotification.setNotifications(
            [
                {
                    message: "Something went wrong.",
                    level: "danger",
                    key: generateGUID()
                },
                ...globalNotification.notifications
            ]
        );
    }
}

// export function parseAutoPartFromForm(event) {
//     const formData = new FormData(event.target);
//     return formData;
// const autoPart = {};
// let prop;
// const formElements = event.target.elements;
// console.log(formData);
// const files = formElements["images"].files;
// console.log(files);
// for(let file of Array.from(files)){
//     console.log(file);
// }
// for(let autoPartConfig of autoPartConfigs) {
//     if(formElements[autoPartConfig.name]) {
//         if(autoPartConfig.type === "number") {
//             prop = Number(formElements[autoPartConfig.name].value);
//         }
//         else {
//             prop = formElements[autoPartConfig.name].value;
//         }
//         autoPart[autoPartConfig.name] = prop;
//     }
// }
// return autoPart;
// }