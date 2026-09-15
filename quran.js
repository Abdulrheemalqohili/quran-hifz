// تشغيل نظام حفظ القرآن وربط السور والآيات والأجزاء والإحصائيات

const surahList =
    document.getElementById("surahList");

const juzList =
    document.getElementById("juzList");

const progressPercent =
    document.querySelector(
        ".progress-info strong"
    );

const progressText =
    document.querySelector(
        ".progress-info span"
    );

const progressFill =
    document.querySelector(
        ".progress-fill"
    );

const stats =
    document.querySelectorAll(
        ".stats article strong"
    );


// =========================
// البيانات المحفوظة
// =========================

let savedSurahs = JSON.parse(
    localStorage.getItem(
        "savedSurahs"
    ) || "[]"
);


// =========================
// قراءة آيات سورة معينة
// =========================

function getSavedAyahs(
    surahNumber
) {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(
                    "ayahs-" + surahNumber
                ) || "[]"
            );

        return Array.isArray(data)
            ? data
            : [];

    } catch {

        return [];

    }

}


// =========================
// حفظ السور
// =========================

function saveSurahs() {

    localStorage.setItem(
        "savedSurahs",
        JSON.stringify(
            savedSurahs
        )
    );

}


// =========================
// مزامنة وتصحيح البيانات
// =========================

function syncAllData() {

    const correctSavedSurahs = [];

    surahs.forEach(
        function (surah) {

            const savedAyahs =
                getSavedAyahs(
                    surah.number
                );


            const validAyahs =
                savedAyahs.filter(
                    function (ayah) {

                        return (
                            Number.isInteger(
                                ayah
                            ) &&
                            ayah >= 1 &&
                            ayah <=
                                surah.verses
                        );

                    }
                );


            const uniqueAyahs =
                [...new Set(
                    validAyahs
                )];


            if (
                uniqueAyahs.length > 0
            ) {

                localStorage.setItem(
                    "ayahs-" +
                    surah.number,
                    JSON.stringify(
                        uniqueAyahs
                    )
                );

            } else {

                localStorage.removeItem(
                    "ayahs-" +
                    surah.number
                );

            }


            if (
                uniqueAyahs.length ===
                surah.verses
            ) {

                correctSavedSurahs.push(
                    surah.number
                );

            }

        }
    );


    savedSurahs =
        correctSavedSurahs;


    saveSurahs();

}


// =========================
// التحقق من حفظ الآية
// =========================

function isAyahSaved(
    surahNumber,
    ayahNumber
) {

    const saved =
        getSavedAyahs(
            surahNumber
        );


    return saved.includes(
        ayahNumber
    );

}


// =========================
// إنشاء بطاقة السورة
// =========================

surahs.forEach(
    function (surah) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "surah-card";


        const label =
            document.createElement(
                "label"
            );


        label.className =
            "surah-item";


        label.innerHTML = `
            <input
                type="checkbox"
                data-number="${surah.number}"
            >

            <span>
                ${surah.number}. ${surah.name}
            </span>

            <small>
                ${surah.verses} آية
            </small>
        `;


        const checkbox =
            label.querySelector(
                "input"
            );


        if (
            savedSurahs.includes(
                surah.number
            )
        ) {

            checkbox.checked = true;

        }


        const ayahSection =
            createAyahSection(
                surah
            );


        label.addEventListener(
            "click",
            function (event) {

                if (
                    event.target.tagName ===
                    "INPUT"
                ) {

                    return;

                }


                openSurah(
                    surah,
                    label,
                    ayahSection
                );

            }
        );


        card.appendChild(label);

        card.appendChild(
            ayahSection
        );

        surahList.appendChild(
            card
        );

    }
);


// =========================
// إنشاء بطاقة آيات السورة
// =========================

function createAyahSection(
    surah
) {

    const section =
        document.createElement(
            "section"
        );


    section.className =
        "ayah-section";


    section.innerHTML = `
        <div class="ayah-header">

            <h2>
                متابعة آيات السورة
            </h2>

            <button type="button">
                إغلاق
            </button>

        </div>

        <div class="ayah-progress">

            <strong>
                0%
            </strong>

            <span>
                0 من ${surah.verses} آية
            </span>

        </div>

        <div class="ayah-progress-bar">

            <div class="ayah-progress-fill"></div>

        </div>

        <div class="ayah-list"></div>
    `;


    const button =
        section.querySelector(
            "button"
        );


    button.addEventListener(
        "click",
        function () {

            section.classList.remove(
                "active"
            );

            const card =
                section.closest(
                    ".surah-card"
                );

            if (card) {

                card.querySelector(
                    ".surah-item"
                ).classList.remove(
                    "active-surah"
                );

            }

        }
    );


    return section;

}


// =========================
// فتح السورة
// =========================

function openSurah(
    surah,
    surahElement,
    section
) {

    document
        .querySelectorAll(
            ".ayah-section.active"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "active"
                );

            }
        );


    document
        .querySelectorAll(
            ".active-surah"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "active-surah"
                );

            }
        );


    surahElement.classList.add(
        "active-surah"
    );


    section.classList.add(
        "active"
    );


    renderAyahs(
        surah,
        section
    );

}


// =========================
// إنشاء آيات السورة
// =========================

function renderAyahs(
    surah,
    section
) {

    const ayahList =
        section.querySelector(
            ".ayah-list"
        );


    const progressPercent =
        section.querySelector(
            ".ayah-progress strong"
        );


    const progressText =
        section.querySelector(
            ".ayah-progress span"
        );


    const progressFill =
        section.querySelector(
            ".ayah-progress-fill"
        );


    ayahList.innerHTML = "";


    const saved =
        getSavedAyahs(
            surah.number
        );


    for (
        let number = 1;
        number <= surah.verses;
        number++
    ) {

        const label =
            document.createElement(
                "label"
            );


        label.className =
            "ayah-item";


        label.innerHTML = `
            <input
                type="checkbox"
                data-ayah="${number}"
            >

            <span>
                الآية ${number}
            </span>
        `;


        const checkbox =
            label.querySelector(
                "input"
            );


        if (
            saved.includes(number)
        ) {

            checkbox.checked = true;

            label.classList.add(
                "saved-ayah"
            );

        }


        checkbox.addEventListener(
            "change",
            function () {

                if (
                    checkbox.checked
                ) {

                    label.classList.add(
                        "saved-ayah"
                    );

                } else {

                    label.classList.remove(
                        "saved-ayah"
                    );

                }


                saveAyahs(
                    surah,
                    section
                );


                syncSurah(
                    surah
                );


                updateAyahProgress(
                    surah,
                    section
                );


                updateProgress();

            }
        );


        ayahList.appendChild(
            label
        );

    }


    updateAyahProgress(
        surah,
        section
    );

}


// =========================
// حفظ آيات السورة
// =========================

function saveAyahs(
    surah,
    section
) {

    const selected = [];


    section
        .querySelectorAll(
            'input[type="checkbox"]'
        )
        .forEach(
            function (checkbox) {

                if (
                    checkbox.checked
                ) {

                    selected.push(
                        Number(
                            checkbox.dataset.ayah
                        )
                    );

                }

            }
        );


    if (
        selected.length > 0
    ) {

        localStorage.setItem(
            "ayahs-" +
            surah.number,
            JSON.stringify(
                selected
            )
        );

    } else {

        localStorage.removeItem(
            "ayahs-" +
            surah.number
        );

    }

}


// =========================
// مزامنة السورة
// =========================

function syncSurah(
    surah
) {

    const saved =
        getSavedAyahs(
            surah.number
        );


    const allSaved =
        saved.length ===
        surah.verses;


    const index =
        savedSurahs.indexOf(
            surah.number
        );


    if (
        allSaved &&
        index === -1
    ) {

        savedSurahs.push(
            surah.number
        );

    }


    if (
        !allSaved &&
        index !== -1
    ) {

        savedSurahs.splice(
            index,
            1
        );

    }


    saveSurahs();


    updateSurahVisual(
        surah.number,
        allSaved
    );

}


// =========================
// تحديث شكل السورة
// =========================

function updateSurahVisual(
    surahNumber,
    saved
) {

    const checkbox =
        surahList.querySelector(
            `input[data-number="${surahNumber}"]`
        );


    if (!checkbox) {
        return;
    }


    const item =
        checkbox.closest(
            ".surah-item"
        );


    if (!item) {
        return;
    }


    checkbox.checked =
        saved;


    item.classList.toggle(
        "saved-surah",
        saved
    );

}


// =========================
// تحديث تقدم آيات السورة
// =========================

function updateAyahProgress(
    surah,
    section
) {

    let savedCount = 0;


    for (
        let number = 1;
        number <= surah.verses;
        number++
    ) {

        if (
            isAyahSaved(
                surah.number,
                number
            )
        ) {

            savedCount++;

        }

    }


    const percentage =
        (
            savedCount /
            surah.verses
        ) * 100;


    section.querySelector(
        ".ayah-progress strong"
    ).textContent =
        percentage.toFixed(1) +
        "%";


    section.querySelector(
        ".ayah-progress span"
    ).textContent =
        savedCount +
        " من " +
        surah.verses +
        " آية";


    section.querySelector(
        ".ayah-progress-fill"
    ).style.width =
        percentage + "%";

}


// =========================
// حساب الآيات المحفوظة
// =========================

function calculateSavedAyahs() {

    let total = 0;


    surahs.forEach(
        function (surah) {

            total +=
                getSavedAyahs(
                    surah.number
                ).length;

        }
    );


    return total;

}


// =========================
// التحقق من اكتمال الجزء
// =========================

function isJuzComplete(
    juz
) {

    const startSurah =
        juz.start[0];

    const startAyah =
        juz.start[1];

    const endSurah =
        juz.end[0];

    const endAyah =
        juz.end[1];


    for (
        let surahNumber =
            startSurah;

        surahNumber <=
            endSurah;

        surahNumber++
    ) {

        const surah =
            surahs.find(
                function (item) {

                    return (
                        item.number ===
                        surahNumber
                    );

                }
            );


        if (!surah) {
            return false;
        }


        let firstAyah = 1;

        let lastAyah =
            surah.verses;


        if (
            surahNumber ===
            startSurah
        ) {

            firstAyah =
                startAyah;

        }


        if (
            surahNumber ===
            endSurah
        ) {

            lastAyah =
                endAyah;

        }


        for (
            let ayah =
                firstAyah;

            ayah <=
                lastAyah;

            ayah++
        ) {

            if (
                !isAyahSaved(
                    surahNumber,
                    ayah
                )
            ) {

                return false;

            }

        }

    }


    return true;

}


// =========================
// حساب الأجزاء المكتملة
// =========================

function calculateCompletedJuz() {

    let completed = 0;


    juzs.forEach(
        function (juz) {

            if (
                isJuzComplete(juz)
            ) {

                completed++;

            }

        }
    );


    return completed;

}


// =========================
// تحديث التقدم العام
// =========================

function updateProgress() {

    const savedCount =
        savedSurahs.length;


    const remainingCount =
        surahs.length -
        savedCount;


    const savedVerses =
        calculateSavedAyahs();


    const completedJuz =
        calculateCompletedJuz();


    const percentage =
        (
            savedCount /
            surahs.length
        ) * 100;


    progressPercent.textContent =
        percentage.toFixed(1) +
        "%";


    progressText.textContent =
        savedCount +
        " من 114 سورة";


    progressFill.style.width =
        percentage + "%";


    stats[0].textContent =
        savedCount;


    stats[1].textContent =
        remainingCount;


    stats[2].textContent =
        savedVerses;


    stats[3].textContent =
        completedJuz;

}


// =========================
// مراقبة مربعات السور
// =========================

surahList.addEventListener(
    "change",
    function (event) {

        const checkbox =
            event.target;


        if (
            checkbox.tagName !==
            "INPUT"
        ) {

            return;

        }


        const surahNumber =
            Number(
                checkbox.dataset.number
            );


        const surah =
            surahs.find(
                function (item) {

                    return (
                        item.number ===
                        surahNumber
                    );

                }
            );


        if (!surah) {
            return;
        }


        if (
            checkbox.checked
        ) {

            if (
                !savedSurahs.includes(
                    surahNumber
                )
            ) {

                savedSurahs.push(
                    surahNumber
                );

            }


            const allAyahs = [];


            for (
                let number = 1;
                number <=
                    surah.verses;
                number++
            ) {

                allAyahs.push(
                    number
                );

            }


            localStorage.setItem(
                "ayahs-" +
                surahNumber,
                JSON.stringify(
                    allAyahs
                )
            );


            updateSurahVisual(
                surahNumber,
                true
            );

        } else {

            const index =
                savedSurahs.indexOf(
                    surahNumber
                );


            if (
                index !== -1
            ) {

                savedSurahs.splice(
                    index,
                    1
                );

            }


            localStorage.removeItem(
                "ayahs-" +
                surahNumber
            );


            updateSurahVisual(
                surahNumber,
                false
            );

        }


        saveSurahs();

        updateProgress();

    }
);


// =========================
// تشغيل البرنامج
// =========================

syncAllData();


surahs.forEach(
    function (surah) {

        updateSurahVisual(
            surah.number,
            savedSurahs.includes(
                surah.number
            )
        );

    }
);


updateProgress();