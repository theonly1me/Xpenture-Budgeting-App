//Way to create encapsulated controllers if by creating 
//Immediately Invoked Function Expressions
'use strict'; // enable strict mode

var uiController = (() => {
    //The code for uiController goes here...
    var DOMStrings = {
        inputType: '.add__type',
        inputDesc: '.add__description',
        inputValue: '.add__value',
        addBtn: '.add__btn',
        expenseList: '.expenses__list',
        incomeList: '.income__list',
        month: '.budget__title--month',
        totalInc: '.budget__income--value',
        totalExp: '.budget__expenses--value',
        totalBudget: '.budget__value',
        expensePercentage: '.budget__expenses--percentage',
        container: '.container'
    };
    return {
        setMonth: () => {
            let currentDate = new Date();
            currentMonth = currentDate.getMonth();
            currentYear = currentDate.getFullYear();
            switch (currentMonth) {
                case 0: currentMonth = 'January';
                    break;
                case 1: currentMonth = 'February';
                    break;
                case 2: currentMonth = 'March';
                    break;
                case 3: currentMonth = 'April';
                    break;
                case 4: currentMonth = 'May';
                    break;
                case 5: currentMonth = 'June';
                    break;
                case 6: currentMonth = 'July';
                    break;
                case 7: currentMonth = 'August';
                    break;
                case 8: currentMonth = 'September';
                    break;
                case 9: currentMonth = 'October';
                    break;
                case 10: currentMonth = 'November';
                    break;
                case 11: currentMonth = 'December';
                    break;
            }
            document.querySelector(DOMStrings.month).textContent = currentMonth + ' ' + currentYear;
        },
        setTotals: (incs, exps, percentageExp) => {
            document.querySelector(DOMStrings.totalInc).textContent = '+ ' + incs;
            document.querySelector(DOMStrings.totalExp).textContent = '+ ' + exps;
            // percentageExp = exps/incs * 100;
            if (percentageExp > 0)
                document.querySelector(DOMStrings.expensePercentage).textContent = Math.round(percentageExp) + '%';
            else
                document.querySelector(DOMStrings.expensePercentage).textContent = '-';
        },
        setBudget: (budget) => {
            debugger;
            budget >= 0 ? document.querySelector(DOMStrings.totalBudget).textContent = '+ ' + budget
                : (document.querySelector(DOMStrings.totalBudget).textContent = budget, alert('Error in entry. Total budget is less than 0.'));
        },
        getInput: () => {
            return {
                addType: document.querySelector(DOMStrings.inputType).value,
                addDesc: document.querySelector(DOMStrings.inputDesc).value,
                addValue: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        getDomStrings: () => {
            return DOMStrings;
        },
        addListItem: (item, type) => {
            var html, element;
            if (type === 'inc') {
                element = DOMStrings.incomeList;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            else {
                element = DOMStrings.expenseList;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">%per%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                html = html.replace('%per%', item.percentage);
            }


            html = html.replace('%id%', item.id);
            html = html.replace('%description%', item.description);
            html = html.replace('%value%', item.value);

            document.querySelector(element).insertAdjacentHTML('beforeEnd', html);
        },
        removeListItem: (itemID) => {
            //Remove element from the DOM
            document.getElementById(itemID).remove();
        },
        clearFields: () => {
            //Clear input fields
            // document.querySelector(DOMStrings.inputDesc).value = '';        
            // document.querySelector(DOMStrings.inputValue).value = '';
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDesc + ',' + DOMStrings.inputValue);
            //use enhanced for on fields list (query selector all returns list -- This came out in ES6 (2015))...
            // for(field of fields){
            //     field.value  = '';
            // }

            fieldsArr = Array.prototype.slice.call(fields);
            //you can skip paranthesis in arrow functions if you only have 1 parameter!!!!  
            fieldsArr.forEach(element => {
                element.value = '';
            });
            fieldsArr[0].focus();
            document.querySelector(DOMStrings.inputType).value = 'inc';
            // fieldsArr.forEach((element, index, fieldsArr)=>{
            //     element.value = '';
            // });
        }
    }

})();

var budgetController = (() => {
    //The code for budgetController goes here...

    var Expense = function (description, value, id, percentage) {
        this.value = value;
        this.description = description;
        this.id = id;
        this.percentage = percentage;
    }

    var Income = function (description, value, id) {
        this.value = value;
        this.description = description;
        this.id = id;
    }

    var transaction = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    }

    var calculateBudget = () => {
        let budget = transaction.totals.inc - transaction.totals.exp;
        return budget;
    }

    return {
        addItem: function (description, value, type) {
            var newItem, id;
            //Select the ID of the last Item of the Transaction Object which contains the Items object
            //increment ID by 1
            transaction.items[type].length === 0 ? id = 0 : id = transaction.items[type][transaction.items[type].length - 1].id + 1;
            type === 'exp' ? newItem = new Expense(description, value, id, '0') : newItem = new Income(description, value, id);
            //Below syntax amounts to transaction.items[inc/exp] - this selects the array which is inside the object
            transaction.items[type].push(newItem);
            if (type === 'exp') {
                transaction.totals.exp += parseFloat(newItem.value);
                let itmValPercent = newItem.value / transaction.totals.exp * 100;
            } else {
                transaction.totals.inc += parseFloat(newItem.value);
            }
            //return new item object
            return newItem;
        },
        removeItem: (type, ID) => {
            //Iterate through the array, check if ID matches, if it does, subtract the value 
            //from total value and remove the element from the datastructure
            let arr = transaction.items[type];
            i = arr.length;
            console.log(arr);
            debugger;
            while (i--) {
                if (arr[i].id === parseInt(ID)) {
                    type === 'inc' ? transaction.totals.inc -= arr[i].value : transaction.totals.exp -= arr[i].value;
                    arr.splice(i, 1);
                    return;
                }
            }
        },
        returnBudget: () => {
            return calculateBudget();
        },
        returnTotals: () => {
            return transaction.totals;
        },
        getPercentOfInc: () => {
            if (transaction.totals.inc > 0)
                percentageExp = transaction.totals.exp / transaction.totals.inc * 100;
            else percentageExp = -1;
            return percentageExp;
        }
    }

})();

var appController = ((budgetCtrl, uiCtrl) => {
    //The code for appController goes here...
    var setUpEventListeners = () => {
        var DOM = uiCtrl.getDomStrings();
        //initialize UI values to 0 from placeholder values
        let fields = document.querySelectorAll(DOM.totalBudget + ',' + DOM.totalExp + ',' + DOM.totalInc + ',' + DOM.expensePercentage);
        let fieldsArr = Array.prototype.slice.call(fields);
        fieldsArr.forEach(element => {
            element.textContent = '-';
        });
        //Set up event listener for add button click
        document.querySelector(DOM.addBtn).addEventListener('click', addItem);
        //Set up event listener when enter key is pressed (instead of click)
        document.querySelector(DOM.inputValue).addEventListener('keypress', (event) => {
            if (event.keyCode === 13 || event.which === 13) {
                addItem();

            }
        });

        document.querySelector(DOM.container).addEventListener('click', deleteItem);
    };

    var updateBudget = () => {
        //Calculate Budget & return Budget
        var totalBudget = budgetCtrl.returnBudget();
        //Set totals on UI
        var totals = budgetCtrl.returnTotals();
        let totalPercentage = budgetCtrl.getPercentOfInc();
        uiCtrl.setTotals(totals.inc, totals.exp, totalPercentage);
        //Display budget on the UI
        uiCtrl.setBudget(totalBudget);
    };

    var addItem = () => {
        //Capture input from textboxes and dropdown 
        var input = uiCtrl.getInput();
        if (input.addDesc !== '' && !isNaN(input.addValue) && input.addValue > 0) {
            //Add item to budget controller
            var newItem = budgetCtrl.addItem(input.addDesc, input.addValue, input.addType);
            //show items on UI
            uiCtrl.addListItem(newItem, input.addType);

            //Clear fields
            uiCtrl.clearFields();
            //Update Budget and set values
            updateBudget();
        }
    };

    var deleteItem = (event) => {
        var itemID, splitID, ID, type;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];

            //delete the item from the data structure
            budgetCtrl.removeItem(type, ID);
            //delete the item from the UI
            uiCtrl.removeListItem(itemID);
            //update and show the budget
            updateBudget();
        }
    };
    return {
        init: () => {
            setUpEventListeners();
            uiCtrl.setMonth();
        }
    }

})(budgetController, uiController);

appController.init();

