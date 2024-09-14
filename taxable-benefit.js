/***
 * @param
 * @returns taxable benefit
 *
 */

THRESHHOLDS = {
    joint: {
        base: 12000,
        combined: 32000,
    },
    single: {
        base: 12000,
        combined: 25000,
    },
};

export function taxableBenefits(ssBenefits, otherIncome, isJoint) {
    const baseThreshold = isJoint
        ? THRESHHOLDS.joint.base
        : THRESHHOLDS.single.base;
    const combinedThreshhold = isJoint
        ? THRESHHOLDS.joint.combined
        : THRESHHOLDS.single.combined;
    // line 2
    const halfSS = Math.round(ssBenefits / 2);

    if (ssBenefits == 0) {
        return 0;
    }
    // line 6
    const combinedAmount = halfSS + otherIncome;
    const adjustedCombinedAmount = combinedAmount - combinedThreshhold;
    if (adjustedCombinedAmount <= 0) {
        return 0;
    }

    // line 10 adjustedCombinedAmount
    // line 11 baseAmountThreashond
    //
    // Which is ss/2 + income - combinedTH
    // line 12
    // Line 12 = line 10 - line 11
    const adjustedBaseAmount = Math.max(
        0,
        adjustedCombinedAmount - baseAmountThreshhold
    );
    // line 13
    const l13 = Math.min(adjustedCombinedAmount, baseAmountThreshhold);
    // Line 14
    const l14 = Math.round(l13 / 2);
    // Line 15
    const l15 = Math.min(halfSS, l14);
    // Line 16
    const l16 = Math.round(adjustedBaseAmount * 0.85);
    const l17 = l15 + l16;
    const l18 = Math.round(ssBenefits * 0.85);
    // line 19
    const taxableBenefits = Math.min(l17, l18); // Line 6b
    return taxableBenefits;
}
