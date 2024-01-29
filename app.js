const btnsContainer = document.getElementById('nums-1to9');
function numBtn(num) {
    return `
        <div class="col-4 mb-1 d-grid">
            <button class="btn btn-block p-3 rounded-circle bg-dark text-white numBtn">${num}</button>
        </div>
    `;
}

let btns='';
for (i=1; i<10; i++) {
    btns += numBtn(i);
}

btnsContainer.innerHTML = btns

const evalSymbols = ['=', 'C', 'Del'];
const opSymbols = ['x', '/', '+', '-'];
const idnSymbols = ['+/-', '.'];

let inputSeeder = [];
let currentInput = '';
let idnInput = '';

const pushCurrentToSeeder = () => {
    inputSeeder.push(`${idnInput}${currentInput}`);
    currentInput = '';
    idnInput = '';
}

const updateDisplay = () => {
    const seederVal = inputSeeder.join('');
    const dispBlock = document.getElementById('disp-block');

    dispBlock.innerHTML = `${seederVal}${idnInput}${currentInput}`;
}
updateDisplay();

const popFromSeeder = () => {
    if(inputSeeder.length) {
        let lastVal = inputSeeder.pop();
        if (lastVal.charAt(0) == '-') {
            idnInput = '-';
            // Remove the first char
            lastVal = lastVal.slice(1, lastVal.length);
        }
        console.log({lastVal});
        currentInput = lastVal;
    }
}

const checkAndPop = () => {
    if(currentInput.length || idnInput.length) {
        return;
    }
    popFromSeeder();
} 

const handleInput = (inputVal) => {
    console.log({inputVal});
    let allowOp = false;

    // check for empty value
    if(inputSeeder.length || currentInput.length) {
        allowOp = true;
    }

    switch (true) {
        case evalSymbols.some(item => item == inputVal): // Check if value if an Operator
            // Process operator            

            switch (inputVal) {
                case 'C':
                    pushCurrentToSeeder();
                    inputSeeder = [];
                    break;
                
                case 'Del':
                    checkAndPop();
                    if (currentInput.length) {
                        currentInput = currentInput.slice(0, currentInput.length-1)
                    } else if (idnInput.length) {
                        idnInput = ''
                    }
                    checkAndPop();
                    break;
            
                default:
                    break;
            }
            break;
    
        case opSymbols.some(item => item == inputVal): // Check if value if an Operator
            // Process operator
            if(!allowOp) {
                return;
            }

            // check if current input is not an operator. If true push current input into seeder.
            if(!opSymbols.some(item => item == currentInput)) {
                pushCurrentToSeeder();
            }

            //  Set incoming inputVal as current input
            currentInput = inputVal;
            break;
    
        case idnSymbols.some(item => item == inputVal): // Check if value if an Operator
            // Process operator

            // check if current input is an operator. If true push current input into seeder.
            if(opSymbols.some(item => item == currentInput)) {
                pushCurrentToSeeder();
            }

            if (inputVal === '.') {
                // handle .
                
                // Check if already in current input.
                if(currentInput.includes('.')) {
                    return;
                }
                console.log(currentInput.length);
                currentInput = currentInput.length ? `${currentInput}.` : '0.';
            }

            if (inputVal === '+/-') {
                // handle +/-
                if (idnInput === '') {
                    idnInput = '-';
                } else {
                    idnInput = '';
                }
            }
            
            break;
    
        case (!isNaN(inputVal)): // Check if value if an Operator
            // Process operator

            // check if current input is an operator. If true push current input into seeder.
            if(opSymbols.some(item => item == currentInput)) {
                pushCurrentToSeeder();
            }

            currentInput = `${currentInput}${inputVal}`;
            break;
    
        default:
            console.log('--- no match');
            break;
    }

    updateDisplay();
}

calcBtns = document.querySelectorAll('.btn');
if(calcBtns.length) {
    calcBtns.forEach(calcBtn => {
        calcBtn.addEventListener('click', (e) => {
            value = e.target.innerHTML;
            handleInput(value);
        })
    });
}
