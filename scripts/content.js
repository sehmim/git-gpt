console.log("------ Hello from content.js ------");

setTimeout( async() => {
  let textarea = document.getElementById('prompt-textarea');

  let inputsToHide = textarea.parentNode;
  // inputsToHide.style.display = 'none';

  const h1Tags = document.getElementsByTagName("h1");
  let chatGPTHeader = null;

  for (let i = 0; i < h1Tags.length; i++) {
    if (h1Tags[i].innerText === "ChatGPT") {
      chatGPTHeader = h1Tags[i];
      break;
    }
  }

  if (chatGPTHeader) {
    chatGPTHeader.innerText = "GitGPT"
  }
  
  console.log("hiding body");
  chatGPTBody = chatGPTHeader.parentNode.childNodes[1];
  chatGPTBody.style.display = 'none';
    
  const generatedHTML = await generateHTML();
  chatGPTHeader.parentNode.appendChild(generatedHTML);

}, 2000);


function clickGeneratingData() {
  const divs = document.getElementsByTagName('button');
  
  for (let i = 0; i < divs.length; i++) {
    const div = divs[i];
    if (div.innerText === 'Stop generating') {
      console.log("div ->", div)
      div.click();
      div.style.display = 'none'; 
      break;
    }
  }
}



const ButtonComponent = (nodeToAppend, textarea) => {
  let button = document.createElement('button');

  button.style.border = "1px solid red";
  button.style.font = "15px";

  button.id = 'trigger';
  button.textContent = 'Generate Tabs';


  button.onclick = function() {
    populateTextArea(textarea);
    clickSubmitButton(textarea);
  };
  
  
  nodeToAppend.appendChild(button);
  console.log("Appending Button");
}


const populateTextArea = (textarea) => {
  textarea.value = "Generate guitar tabs for sweet child of mine as a data table";
}

const clickSubmitButton = (textarea) => {
  const button = textarea.parentNode.childNodes[1];
  button.disabled = false;
  button.click();
  console.log("Question Submitted!");
}

// Logic 
const makeFetchCall = async () => {
  var input = document.getElementById('repo');
  var inputValue = input.value;

  try {
    const response = await fetch(`http://localhost:3000/content?repo=${inputValue}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const fileList = generateFileList(data);
    const box = document.getElementById("box")
    box.appendChild(fileList);
    let textarea = document.getElementById('prompt-textarea');
    let inputsToHide = textarea.parentNode.childNodes[0];
    let submitButtonChatGPT = textarea.parentNode.childNodes[1];
    submitButtonChatGPT.disabled = false;



    data.forEach(file => {
      setTimeout(() => {
        let contents = splitString(file.content);
        textarea.value = contents[0];
        inputsToHide.value = `FILE NAME: ${file.fileName}. FILE_CONTENT: ${file.content}`
        submitButtonChatGPT.click();
        setTimeout(() => {
              clickGeneratingData()
        }, 2000)
      }, 3000);
    });

    // file = data[1];
    // contents = splitString(file.content);
    // textarea.value = contents[0];
    // inputsToHide.value = `FILE NAME: ${file.fileName}. FILE_CONTENT: ${file.content}`
    // submitButtonChatGPT.click();
    // setTimeout(() => {
    //       clickGeneratingData()
    // }, 2000)

    
    // data.forEach((file) => {
    //   setTimeout(() => {
    //     if (contents.length > 1) {
    //       contents.forEach((content) => {
    //         textarea.value = content
    //         inputsToHide.value = `FILE NAME: ${file.fileName}. FILE_CONTENT: ${content}`
    //         submitButtonChatGPT.click();
        
    //         setTimeout(() => {
    //           clickGeneratingData()
    //         }, 3000)
    //       })
    //     } else {
    //       textarea.value = contents[0]
  
    //       inputsToHide.value = `FILE NAME: ${file.fileName}. FILE_CONTENT: ${file.content}`
    //       submitButtonChatGPT.click();
      
    //       setTimeout(() => {
    //         clickGeneratingData()
    //       }, 2000)
    //     }
    //   }, 2000);

    // })

  } catch (error) {
    // Handle any errors that occurred during the fetch request
    console.error('Error:', error);
  }
}

function splitString(inputString) {
  const maxLength = 4096;
  const resultArray = [];

  if (inputString.length <= maxLength) {
    resultArray.push(inputString);
  } else {
    let startIndex = 0;
    while (startIndex < inputString.length) {
      const endIndex = startIndex + maxLength;
      const substring = inputString.substring(startIndex, endIndex);
      resultArray.push(substring);
      startIndex = endIndex;
    }
  }

  return resultArray;
}

// 
async function generateHTML() {
  const boxWrapper = document.createElement('div');
  boxWrapper.style.display = "flex";
  boxWrapper.style.justifyContent = "center";
  boxWrapper.style.alignItems = "center";

  const box = document.createElement('div');
  box.id = "box";
  box.style.backgroundColor = "#f2f2f2";
  box.style.padding = "20px";
  box.style.borderRadius = "10px";
  box.style.textAlign = "center";
  box.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";

  const boxLabel = document.createElement('h5');
  boxLabel.style.fontSize = "24px";
  boxLabel.style.padding = "15px";
  boxLabel.textContent = 'Surf the Web';

  const inputUrl = document.createElement('input');
  inputUrl.type = 'text';
  inputUrl.id = "repo";
  inputUrl.placeholder = 'insert url here...';
  inputUrl.style.width = "100%";
  inputUrl.style.padding = "10px";
  inputUrl.style.marginBottom = "10px";
  inputUrl.style.border = "1px solid #ccc";
  inputUrl.style.borderRadius = "5px";

  const inputSubmitButton = document.createElement('input');
  inputSubmitButton.type = 'button';
  inputSubmitButton.value = 'submit';
  inputSubmitButton.style.backgroundColor = "#4CAF50";
  inputSubmitButton.style.color = "white";
  inputSubmitButton.style.padding = "10px 20px";
  inputSubmitButton.style.borderRadius = "5px";
  inputSubmitButton.style.cursor = "pointer"

  inputSubmitButton.onclick = await makeFetchCall;

  box.appendChild(boxLabel);
  box.appendChild(inputUrl);
  box.appendChild(inputSubmitButton);

  boxWrapper.appendChild(box);

  return boxWrapper;
}

const LoadingComponent = () => {
  const loadingWrapper = document.createElement('div');
  loadingWrapper.classList.add('loading-wrapper');

  const loadingText = document.createElement('p');
  loadingText.classList.add('loading-text');
  loadingText.textContent = 'loading...';

  loadingWrapper.appendChild(loadingText);
}

function generateFileList(fileArray) {
  const ul = document.createElement('ul');

  fileArray.forEach((file) => {
    const li = document.createElement('li');
    li.textContent = file.fileName;
    ul.appendChild(li);
  });

  return ul;
}