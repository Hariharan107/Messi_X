import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.getElementById("chat_container")

let loadInterval;

const loader = (element) => {
    element.textContent = ''
  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent==='....') {
      element.textContent = "";
    }
  }, 300);
};

const typeText = (element, text) => {
  let index = 0;
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else clearInterval(interval);
  }, 20);
};

const generateUniqueId = () => {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexDecimalNumber = randomNumber.toString(16);
  return `id-${timeStamp}-${hexDecimalNumber}`;
};

const chatStripe = (isAi, value, UniqueId) => {
  return `
        <div class="wrapper ${isAi && "ai"}">
            <div class="chat">
                <div class="profile">
                    <img src="${isAi ? bot : user}" alt="${isAi ? bot : user}"/>
                </div>
                <div class="message" id=${UniqueId}>${value}</div>
            </div>
        </div>

        `;
};

const submitHandler = async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
  form.reset();

  //Ai chatStripe
  const UniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", UniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const messageDiv = document.getElementById(UniqueId)
    loader(messageDiv)


    const response=await fetch("https://messi-x.onrender.com/",{
        method:'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            prompt:data.get("prompt")
        })
    })
    clearInterval(loadInterval)
    messageDiv.innerHTML =" "
    if(response.ok)
    {
        const data=await response.json()
        const parsedData=data.bot.trim()
        typeText(messageDiv,parsedData)
    }
    else{
        const err=await response.text();
        messageDiv.innerHTML="Sorry,Something went wrong.Please try again :("
        console.log(err)
        
    }
};


form.addEventListener("submit",submitHandler)

form.addEventListener('keyup',(e)=>
{
    if(e.key==="Enter")
    {
        submitHandler(e)
    }
  
})