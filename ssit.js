/***
 * Social Security Income Tax
 *
 * Estimate your 2023 1040 income tax on social security benefits and
 * taxable income.
 *
 *
 */

/***
 * Set up listeners for text and check boxes
 * Update the tax and worksheet output fields.
 *
 * todo: add listeners for the new income boxes.
 * bug: Ensure that the input, isJoint is done right.
 *
 */
window.onload = (event) => {
    // Set the radio button to joint
    document.getElementById("ss-benefits").onchange = (e) => {
        calculateTax();
    };
    document.getElementById("other-income").onchange = (e) => {
        calculateTax();
    };

    document.getElementById("jointly").onclick = (e) => {
        calculateTax();
    };
    document.getElementById("single").onclick = (e) => {
        calculateTax();
    };
    document.getElementById("wages").onclick = (e) => {
        calculateTax();
    };
    document.getElementById("interest").onclick = (e) => {
        calculateTax();
    };
    document.getElementById("dividends").onclick = (e) => {
        calculateTax();
    };
    document.getElementById("ira-dist").onclick = (e) => {
        calculateTax();
    };
    document.getElementById("pension").onclick = (e) => {
        calculateTax();
    };
    document.getElementById("senior").onclick = (e) => {
        calculateTax();
    };
    document.getElementById("spouse-senior").onclick = (e) => {
        calculateTax();
    };
    document.getElementById("blind").onclick = (e) => {
        calculateTax();
    };
    document.getElementById("spouse-blind").onclick = (e) => {
        calculateTax();
    };

    calculateTax();
};

// ----------------
// Get a numeric value from an input box
// input: ele
//
/**
 * Extract a numeric value from the element
 * A side effect of this routine is show the value 0 as blank
 *
 * @param {*} ele
 * @returns numeric value
 *
 */
function numberFromElement(ele) {
    console.log(ele);
    const valueAsNumber = ele.valueAsNumber;
    console.log({ valueAsNumber });
    const result =
        isNaN(valueAsNumber) || valueAsNumber <= 0 ? 0 : valueAsNumber;
    console.log({ result });
    if (result == 0) {
        ele.value = "";
    }
    return result;
}

/**
 * Puts numeric value into ele
 * @param {*} ele
 * @param {*} value
 */
function numberToElement(ele, value) {
    if (value == 0) {
        ele.innerHTML = "";
    } else {
        ele.innerHTML = value;
    }
}
/**
 *
 * Go line by line through worksheet one:
 *  https://www.irs.gov/publications/p915#en_US_2023_publink1000293181
 *
 */
function calculateTax() {
    const isJoint = document.getElementById("jointly").checked;
    console.log({ isJoint });

    // ----------
    // Line 1
    // Enter the total amount from SSA-1099 === 1040 line 5a
    let ele = document.getElementById("ss-benefits");
    console.log("ss-benefits", { ele });
    const ssBenefits = numberFromElement(ele);
    console.log("Line1", { ssBenefits });
    // ----------
    // Line 2
    const halfSS = Math.round(ssBenefits / 2);
    console.log({ halfSS });
    ele = document.getElementById("half-ss");
    numberToElement(ele, halfSS);
    // ------------
    // Line 3 rename to taxable-income
    const otherIncome = getOtherIncome();
    console.log("Results", { otherIncome });
    numberToElement(document.getElementById("other-income"), otherIncome);
    console.log({ otherIncome });
    let taxableBenefits = 0;
    // -------------
    // line 6
    if (ssBenefits) {
        // line 6 income + half
        const combinedAmount = halfSS + otherIncome;
        numberToElement(
            document.getElementById("combined-amount"),
            combinedAmount
        );
        console.log("line 6", { combinedAmount });
        // ----------------
        // Line 9
        const combinedAmountThreshhold = isJoint ? 32000 : 25000;
        numberToElement(
            document.getElementById("combined-amount-threshhold"),
            combinedAmountThreshhold
        );
        // ------------------
        // line 10 rename to adjusted-combined-income
        if (combinedAmount > combinedAmountThreshhold) {
            //32000
            //line 10 = line 8 - line 9
            let adjustedCombinedAmount =
                combinedAmount - combinedAmountThreshhold;

            numberToElement(
                document.getElementById("adjusted-combined-amount"),
                adjustedCombinedAmount
            );
            console.log("line 10", { adjustedCombinedAmount });

            // ------------------
            // Line 11
            const baseAmountThreshhold = isJoint ? 12000 : 9000;
            console.log("line 11", { baseAmountThreshhold });
            numberToElement(
                document.getElementById("base-amount-threshhold"),
                baseAmountThreshhold
            );

            // ------------------
            // Line 12 = line 10 - line 11
            const adjustedBaseAmount = Math.max(
                0,
                adjustedCombinedAmount - baseAmountThreshhold
            ); // 12000
            console.log("line 12", { adjustedBaseAmount });

            numberToElement(
                document.getElementById("adjusted-base-amount"),
                adjustedBaseAmount
            );
            // ------------------
            // line 13 = min line 10 line 11
            let l13 = Math.min(adjustedCombinedAmount, baseAmountThreshhold);
            numberToElement(document.getElementById("l13"), l13);

            // -----------------
            // Line 14
            let l14 = Math.round(l13 / 2);
            numberToElement(document.getElementById("l14"), l14);
            // -----------------
            // Line 15
            let l15 = Math.min(halfSS, l14);
            numberToElement(document.getElementById("l15"), l15);
            // -----------------
            // Line 16
            let l16 = Math.round(adjustedBaseAmount * 0.85);
            numberToElement(document.getElementById("l16"), l16);

            // -----------------
            // Line 17
            let l17 = l15 + l16;
            numberToElement(document.getElementById("l17"), l17);

            // -----------------
            // Line 18
            let l18 = Math.round(ssBenefits * 0.85);
            numberToElement(document.getElementById("l18"), l18);
            // line 19
            taxableBenefits = Math.min(l17, l18); // Line 6b
            numberToElement(
                document.getElementById("taxable-amount"),
                taxableBenefits
            );
        } else {
            numberToElement(
                document.getElementById("adjusted-combined-amount"),
                0
            );
            const baseAmountThreshhold = isJoint ? 12000 : 9000;
            numberToElement(
                (document.getElementById("base-amount-threshhold"),
                baseAmountThreshhold)
            );
            numberToElement(document.getElementById("adjusted-base-amount"), 0);

            document.getElementById("l13").innerHTML = "";
            document.getElementById("l14").innerHTML = "";
            document.getElementById("l15").innerHTML = "";
            document.getElementById("l16").innerHTML = "";
            document.getElementById("l17").innerHTML = "";
            document.getElementById("l18").innerHTML = "";

            numberToElement(
                document.getElementById("taxable-amount"),
                taxableBenefits
            );
        }
    } else {
        numberToElement(document.getElementById("adjusted-combined-amount"), 0);
        const baseAmountThreshhold = isJoint ? 12000 : 9000;
        numberToElement(
            (document.getElementById("base-amount-threshhold"),
            baseAmountThreshhold)
        );
        numberToElement(document.getElementById("adjusted-base-amount"), 0);

        document.getElementById("l13").innerHTML = "";
        document.getElementById("l14").innerHTML = "";
        document.getElementById("l15").innerHTML = "";
        document.getElementById("l16").innerHTML = "";
        document.getElementById("l17").innerHTML = "";
        document.getElementById("l18").innerHTML = "";

        numberToElement(
            document.getElementById("taxable-amount"),
            taxableBenefits
        );
    }

    //---
    // Line 6b
    numberToElement(
        document.getElementById("taxable-benefits"),
        taxableBenefits
    );

    // 1040 line 11
    let adjustedGrossIncome = taxableBenefits + otherIncome;
    console.log({ adjustedGrossIncome });
    numberToElement(
        document.getElementById("adj-gross-income"),
        adjustedGrossIncome
    );
    // 1040 line 12
    const standardDeduction = computeStandardDeduction(isJoint);
    console.log({ standardDeduction });
    numberToElement(
        document.getElementById("standard-deduction"),
        standardDeduction
    );
    // 1040 line
    const finalTaxableIncome = Math.max(
        adjustedGrossIncome - standardDeduction,
        0
    );
    console.log({ finalTaxableIncome });
    numberToElement(
        document.getElementById("taxable-income"),
        finalTaxableIncome
    );
    // 1040 line 15
    const tax = taxOnIncome(finalTaxableIncome, isJoint);
    console.log({ tax });
    numberToElement(document.getElementById("tax"), tax);
    //let over65Count = 2;
    //let standardDeduction = isJoint ? 27700 : 13850;
    //standardDeduction += isJoint ? over65Count * 1500 : over65Count * 1850;
}

/**
 *
 * @returns
 */
function getOtherIncome() {
    console.log("getOtherIncome");
    const wages = numberFromElement(document.getElementById("wages"));
    console.log({ wages });
    const interest = numberFromElement(document.getElementById("interest"));
    console.log({ interest });
    const dividends = numberFromElement(document.getElementById("dividends"));
    console.log({ dividends });
    const iraDist = numberFromElement(document.getElementById("ira-dist"));
    console.log({ iraDist });
    const pension = numberFromElement(document.getElementById("pension"));
    console.log({ pension });
    const taxableIncome = wages + interest + dividends + iraDist + pension;
    console.log({ wages });
    return taxableIncome;
}
const STD_SINGLE_2023 = 13850;
const STD_SINGLE_2024 = 14600;
const STD_JOINT_2023 = 27700;
const STD_JOINT_2024 = 29200;
const ADDL_STD_SINGLE_2023 = 1850;
const ADDL_STD_SINGLE_2024 = 1900;
const ADDL_STD_JOINT_2023 = 1500;
const ADDL_STD_JOINT_2024 = 1500;
const IS_2023 = true;

/**
 *
 * @param {*} isJoint
 * @returns
 */
function computeStandardDeduction(isJoint) {
    console.log("compute standard deduction");
    console.log(document.getElementById("senior").checked);
    const boxesChecked =
        (document.getElementById("senior").checked ? 1 : 0) +
        (document.getElementById("blind").checked ? 1 : 0) +
        (document.getElementById("spouse-senior").checked ? 1 : 0) +
        (document.getElementById("spouse-blind").checked ? 1 : 0);
    console.log({ boxesChecked });
    if (isJoint) {
        return STD_JOINT_2024 + ADDL_STD_JOINT_2024 * boxesChecked;
    } else {
        return STD_SINGLE_2024 + ADDL_STD_SINGLE_2024 * boxesChecked;
    }
}
/***
 * Tax rate tables
 * https://www.irs.gov/pub/irs-drop/rp-23-34.pdf
 *
 */
const IncomeBracketJoint = [
    0,
    23200,
    94_300,
    201_050,
    383_900,
    487_450,
    731_200,
    Infinity,
];
const ExcessRateSingle = [10, 12, 22, 24, 32, 35, 37];
const TaxJoint = [0, 2320, 10852, 32337, 78221, 111357, 196669.5];

const IncomeBracketSingle = [
    0,
    11600,
    47150,
    100525,
    191950,
    243725,
    609350,
    Infinity,
];
const ExcessRateJoint = [10, 12, 22, 24, 32, 35, 37];
const TaxSingle = [0, 1160, 5426, 17168, 39110.5, 55678.5, 183647.25];

/***
 * @param isJoint
 */
function taxOnIncome(income, isJoint) {
    const Tax = isJoint ? TaxJoint : TaxSingle;
    const ExcessRate = isJoint ? ExcessRateJoint : ExcessRateSingle;
    const IncomeBracket = isJoint ? IncomeBracketJoint : IncomeBracketSingle;

    for (let i = 0; i < Tax.length; i++) {
        if (income < IncomeBracket[i + 1]) {
            return Tax[i] + (ExcessRate[i] / 100) * (income - IncomeBracket[i]);
        }
    }
}
// prettier-ignore
let list = [
    0, 10000, 23_200, 50_000, 94300, 100_000, 201_050,400_000, 500_000,
    1_000_000,
];
for (let i = 0; i < list.length; i++) {
    let income = list[i];
    let tax = taxOnIncome(income, true);
    console.log("finished:", i, income, tax);
}
