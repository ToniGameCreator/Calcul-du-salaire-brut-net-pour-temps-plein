
function calculerSalaire() {

    const salaireBrut = Number(document.getElementById("salaire").value);
    const statut = document.getElementById("statut").value;
    const nombreEnfants = Number(document.getElementById("enfants").value);
    const situation = document.getElementById("situation").value;

    const erreur = document.getElementById("erreur");
    const resultats = document.getElementById("resultats");

    erreur.textContent = "";
    resultats.hidden = true;

    // VALIDATION

    if (!Number.isFinite(salaireBrut) || salaireBrut <= 0) {
        erreur.textContent = "Veuillez encoder un salaire brut valide.";
        return;
    }

    if (!Number.isInteger(nombreEnfants) || nombreEnfants < 0) {
        erreur.textContent = "Veuillez encoder un nombre d'enfants valide.";
        return;
    }

    // 1. ONSS

    let ONSS;

    if (statut === "1") {
        ONSS = salaireBrut * 0.1307;
    } else {
        ONSS = salaireBrut * 1.08 * 0.1307;
    }

    const salaireImposable = salaireBrut - ONSS;

    // 2. VOLETS A ET B

    let A, B;

    if (statut === "1") {

        if (salaireBrut <= 2937.93) {
            A = 127.54;
        } else if (salaireBrut <= 3403.62) {
            A = 127.54 - (0.2739 * (salaireBrut - 2937.93));
        } else {
            A = 0;
        }

        if (salaireBrut <= 2300.62) {
            B = 171.99;
        } else if (salaireBrut <= 2937.93) {
            B = 171.99 - (0.2699 * (salaireBrut - 2300.62));
        } else {
            B = 0;
        }

    } else {

        if (salaireBrut <= 2937.93) {
            A = 137.74;
        } else if (salaireBrut <= 3403.62) {
            A = 137.74 - (0.2958 * (salaireBrut - 2937.93));
        } else {
            A = 0;
        }

        if (salaireBrut <= 2300.62) {
            B = 185.75;
        } else if (salaireBrut <= 2937.93) {
            B = 185.75 - (0.2915 * (salaireBrut - 2300.62));
        } else {
            B = 0;
        }
    }

    // 3. ADAPTATION DES VOLETS

    if (A + B > ONSS) {
        A = ONSS - B;

        if (A < 0) {
            A = 0;
            B = ONSS;
        }
    }

    // 4. SALAIRE NET IMPOSABLE

    const salaireNetImposable = salaireImposable + A + B;

    const salaireNetImposableAnnuel = salaireNetImposable * 12;

    // 5. FRAIS PROFESSIONNELS

    let fraisProfessionnels = salaireNetImposableAnnuel * 0.30;

    if (fraisProfessionnels > 6070) {
        fraisProfessionnels = 6070;
    }

    const revenuNetImposable =
        salaireNetImposableAnnuel - fraisProfessionnels;

    // 6. CALCUL DE L'IMPOT

    let impot;

    if (revenuNetImposable <= 16710) {

        impot = revenuNetImposable * 0.2675;

    } else if (revenuNetImposable <= 29500) {

        impot = 4469.93 +
            (0.4280 * (revenuNetImposable - 16710.01));

    } else if (revenuNetImposable <= 51050) {

        impot = 9944.05 +
            (0.4815 * (revenuNetImposable - 29500.01));

    } else {

        impot = 20320.38 +
            (0.5350 * (revenuNetImposable - 51050));
    }

    // 7. MONTANT EXEMPTE

    const montantExempte = 2987.98;

    let impotApresExemption = impot - montantExempte;

    if (impotApresExemption < 0) {
        impotApresExemption = 0;
    }

    // 8. REDUCTION POUR ENFANTS

    const reductionsEnfants = [
        0, 624, 1656, 4404, 7620,
        11100, 14592, 18120, 21996
    ];

    let reductionEnfants;

    if (nombreEnfants <= 8) {
        reductionEnfants = reductionsEnfants[nombreEnfants];
    } else {
        reductionEnfants = 21996 + ((nombreEnfants - 8) * 3864);
    }

    // 9. IMPOT FINAL

    let impotFinal = impotApresExemption - reductionEnfants;

    if (impotFinal < 0) {
        impotFinal = 0;
    }

    const impotMensuel = impotFinal / 12;

    // 10. AUTRES REDUCTIONS

    const reductionA = A * 0.3314;
    const reductionB = B * 0.63;

    const autresReductions = reductionA + reductionB;

    // 11. PRECOMPTE PROFESSIONNEL

    let precompteProfessionnel = impotMensuel - autresReductions;

    if (precompteProfessionnel < 0) {
        precompteProfessionnel = 0;
    }

    // 12. COTISATION SPECIALE

    let salaireReference;

    if (statut === "1") {
        salaireReference = salaireBrut;
    } else {
        salaireReference = salaireBrut * 1.08;
    }

    let cotisationSpeciale = 0;

    if (situation === "1") {

        if (salaireReference <= 1095.09) {
            cotisationSpeciale = 0;

        } else if (salaireReference <= 1945.38) {
            cotisationSpeciale = 0;

        } else if (salaireReference <= 2190.18) {
            cotisationSpeciale =
                0.059 * (salaireReference - 1945.39);

        } else if (salaireReference <= 6038.82) {
            cotisationSpeciale =
                14.44 + (0.011 * (salaireReference - 2190.19));

        } else {
            cotisationSpeciale = 0;
        }

    } else {

        if (salaireReference <= 1095.09) {
            cotisationSpeciale = 0;

        } else if (salaireReference <= 1945.38) {
            cotisationSpeciale = 5.15;

        } else if (salaireReference <= 2190.18) {
            cotisationSpeciale =
                14.44 + (0.011 * (salaireReference - 1945.39));

        } else if (salaireReference <= 6038.82) {
            cotisationSpeciale =
                14.44 + (0.011 * (salaireReference - 2190.19));

        } else {
            cotisationSpeciale = 0;
        }
    }

    // 13. SALAIRE NET FINAL

    const salaireNetMensuel =
        salaireNetImposable
        - precompteProfessionnel
        - cotisationSpeciale;

    // 14. AFFICHAGE DES RESULTATS

    const euro = valeur =>
        valeur.toLocaleString("fr-BE", {
            style: "currency",
            currency: "EUR"
        });

    document.getElementById("netFinal").textContent =
        euro(salaireNetMensuel);

    document.getElementById("brut").textContent =
        euro(salaireBrut);

    document.getElementById("onss").textContent =
        euro(ONSS);

    document.getElementById("imposable").textContent =
        euro(salaireNetImposable);

    document.getElementById("voletA").textContent =
        euro(A);

    document.getElementById("voletB").textContent =
        euro(B);

    document.getElementById("impotMensuel").textContent =
        euro(impotMensuel);

    document.getElementById("reductionA").textContent =
        euro(reductionA);

    document.getElementById("reductionB").textContent =
        euro(reductionB);

    document.getElementById("precompte").textContent =
        euro(precompteProfessionnel);

    document.getElementById("cotisation").textContent =
        euro(cotisationSpeciale);

    document.getElementById("netDetail").textContent =
        euro(salaireNetMensuel);

    resultats.hidden = false;

    // Avertissement si la cotisation spéciale dépasse le barème fourni

    if (salaireReference > 6038.82) {
        erreur.textContent =
            "Attention : le barème de cotisation spéciale fourni ne définit pas les montants au-delà de 6 038,82 €. Le calcul utilise 0 € pour cette cotisation dans cette situation.";
    }

}
