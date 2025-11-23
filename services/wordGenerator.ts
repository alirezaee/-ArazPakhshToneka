import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, AlignmentType, WidthType, BorderStyle } from "docx";
import FileSaver from "file-saver";
import { FormData, EducationRecord, WorkExperience, Guarantor, FamilyMember, TrainingCourse } from "../types";

const createTextParams = (text: string, bold = false, size = 24) => ({
    text: text || "---",
    font: "Arial", // Fallback for RTL usually requires specific fonts, but standard Word handles system fonts okay.
    bold: bold,
    size: size,
    rightToLeft: true,
});

const createLabelValue = (label: string, value: string | boolean) => {
    let displayValue = value;
    if (typeof value === 'boolean') {
        displayValue = value ? "بله ☑" : "خیر ☐";
    }
    return new Paragraph({
        children: [
            new TextRun({ ...createTextParams(label + ": ", true), color: "444444" }),
            new TextRun(createTextParams(String(displayValue))),
        ],
        bidirectional: true,
        alignment: AlignmentType.RIGHT,
        spacing: { after: 100 },
    });
};

const createSectionHeader = (title: string) => {
    return new Paragraph({
        children: [
            new TextRun({
                text: title,
                bold: true,
                size: 28,
                color: "2E74B5",
                font: "Arial",
                rightToLeft: true
            }),
        ],
        bidirectional: true,
        alignment: AlignmentType.RIGHT,
        spacing: { before: 300, after: 200 },
        border: {
            bottom: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" }
        }
    });
};

const createTable = (headers: string[], data: string[][]) => {
    return new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: headers.map(h => new TableCell({
                    children: [new Paragraph({
                        children: [new TextRun({ text: h, bold: true, rightToLeft: true, font: "Arial" })],
                        alignment: AlignmentType.CENTER,
                        bidirectional: true
                    })],
                    shading: { fill: "EEEEEE" },
                })),
            }),
            ...data.map(row => new TableRow({
                children: row.map(cellData => new TableCell({
                    children: [new Paragraph({
                        children: [new TextRun({ text: cellData || "-", rightToLeft: true, font: "Arial" })],
                        alignment: AlignmentType.CENTER,
                        bidirectional: true
                    })],
                })),
            }))
        ],
    });
};

export const generateWordDocument = async (data: FormData) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // Header
                new Paragraph({
                    children: [
                        new TextRun({ text: "به نام خدا", bold: true, size: 32, font: "Arial", rightToLeft: true }),
                    ],
                    alignment: AlignmentType.CENTER,
                    bidirectional: true,
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "فرم درخواست استخدام شرکت آراز پخش تنکا", bold: true, size: 36, font: "Arial", rightToLeft: true }),
                    ],
                    alignment: AlignmentType.CENTER,
                    bidirectional: true,
                    spacing: { after: 400 },
                }),

                createLabelValue("عنوان شغلی مورد نظر", data.targetJobTitle),

                // Section 1: Personal Info
                createSectionHeader("۱. اطلاعات شخصی"),
                createLabelValue("نام و نام خانوادگی", `${data.firstName} ${data.lastName}`),
                createLabelValue("نام پدر", data.fatherName),
                createLabelValue("شماره شناسنامه", data.idNumber),
                createLabelValue("کد ملی", data.nationalId),
                createLabelValue("تاریخ تولد", data.birthDate),
                createLabelValue("محل تولد / صدور", `${data.birthPlace} / ${data.issuePlace}`),
                createLabelValue("دین (مذهب)", data.religion),
                createLabelValue("وضعیت تأهل", data.maritalStatus === 'single' ? "مجرد" : data.maritalStatus === 'married' ? "متأهل" : "مطلقه"),
                createLabelValue("تعداد فرزند", `دختر: ${data.childrenCountDaughter} | پسر: ${data.childrenCountSon}`),
                createLabelValue("وضعیت سلامت", data.healthStatus === 'healthy' ? "سالم هستم" : "مشکل دارم"),
                createLabelValue("گروه خونی", data.bloodType),
                createLabelValue("سابقه بیماری", data.medicalHistory),
                createLabelValue("سابقه جراحی", data.surgeryHistory),
                createLabelValue("توضیحات پزشکی", data.medicalConditionDescription),
                createLabelValue("داروی مصرفی", data.medicationDescription),

                // Section 2: Military
                createSectionHeader("۲. خدمت نظام وظیفه"),
                createLabelValue("وضعیت", data.militaryStatus === 'done' ? "انجام داده" : data.militaryStatus === 'exempt' ? "معاف" : "انجام نداده"),
                createLabelValue("علت معافیت", data.exemptionReason),

                // Section 3: Education
                createSectionHeader("۳. سوابق تحصیلی"),
                createTable(
                    ["مقطع", "رشته", "معدل", "تاریخ پایان", "نوع دانشگاه", "موسسه", "شهر"],
                    data.educationHistory.map((ed: EducationRecord) => [
                        ed.degree, ed.major, ed.gpa, ed.endDate, ed.universityType, ed.instituteName, ed.city
                    ])
                ),

                // Section 4: Work
                createSectionHeader("۴. تجربیات شغلی"),
                createTable(
                    ["سازمان", "سمت", "مدت", "پایان همکاری", "تلفن", "حقوق", "علت ترک"],
                    data.workHistory.map((w: WorkExperience) => [
                        w.organization, w.role, w.duration, w.endDate, w.phone, w.salary, w.reasonForLeaving
                    ])
                ),

                // Section 5 & 6
                createSectionHeader("۵ و ۶. سوابق کیفری و عادات"),
                createLabelValue("سابقه کیفری/بازداشت", data.criminalRecord),
                createLabelValue("توضیح سابقه", data.criminalRecordDesc),
                createLabelValue("مصرف سیگار/مواد", data.smokingDrugs),

                // Section 7: Skills
                createSectionHeader("۷. مهارت‌ها"),
                createLabelValue("زبان انگلیسی (خواندن)", data.langEnglishRead),
                createLabelValue("زبان انگلیسی (نوشتن)", data.langEnglishWrite),
                createLabelValue("زبان انگلیسی (مکالمه)", data.langEnglishSpeak),
                createLabelValue("مهارت‌های کامپیوتر", [
                    data.computerSkills.word && "Word",
                    data.computerSkills.excel && "Excel",
                    data.computerSkills.powerpoint && "PowerPoint",
                    data.computerSkills.windows && "Windows",
                    data.computerSkills.internet && "Internet",
                    data.computerSkills.type && "تایپ",
                    data.computerSkills.access && "Access"
                ].filter(Boolean).join(" , ")),

                new Paragraph({ text: "دوره‌های آموزشی گذرانده شده:", rightToLeft: true, spacing: { before: 100 } }),
                createTable(
                    ["نام دوره", "موسسه", "مدت", "تاریخ شروع", "مدرک دارد؟", "توضیحات"],
                    data.trainingCourses.map((tc: TrainingCourse) => [
                        tc.name, tc.institute, tc.duration, tc.startDate, tc.hasCertificate ? "بله" : "خیر", tc.description
                    ])
                ),

                // Section 8
                createSectionHeader("۸. فعالیت‌های درخواستی"),
                createLabelValue("علاقمندی‌ها", [
                    data.jobTypes.admin && "کارمند اداری",
                    data.jobTypes.phoneSales && "بازاریابی تلفنی",
                    data.jobTypes.fieldSales && "بازاریابی حضوری",
                    data.jobTypes.distributor && "توزیع کننده",
                    data.jobTypes.finance && "امور مالی",
                    data.jobTypes.secretary && "منشی",
                    data.jobTypes.service && "نیروی خدماتی",
                    data.jobTypes.warehouse && "کارگر انبار",
                    data.jobTypes.driver && "راننده",
                    data.jobTypes.anything && "هر کاری بتوانم"
                ].filter(Boolean).join(" , ")),
                createLabelValue("نوع گواهینامه", data.driverLicenseType),
                createLabelValue("مدارک مرتبط", data.relevantDocs),

                // Section 9
                createSectionHeader("۹. نحوه همکاری"),
                createLabelValue("نوع همکاری", data.cooperationType === 'full_time' ? "تمام وقت" : data.cooperationType === 'part_time' ? "پاره وقت" : "دورکاری"),
                createLabelValue("آمادگی اضافه کاری", data.canOvertime ? `بله (${data.overtimeHours} ساعت)` : "خیر"),
                createLabelValue("کار در تعطیلات", data.canWeekends),

                // Section 10
                createSectionHeader("۱۰. روحیات"),
                createLabelValue("روحیه کار تیمی", data.teamwork),
                createLabelValue("علاقمندی‌ها", data.interests),
                createLabelValue("چالش شخصی/خانوادگی", data.personalChallenges ? `بله - ${data.personalChallengesDesc}` : "خیر"),
                createLabelValue("شخصیت", data.introvertExtrovert),
                createLabelValue("ویژگی متمایز", data.uniqueTraits),

                // Section 11
                createSectionHeader("۱۱. زمینه بازاریابی"),
                createLabelValue("زمینه‌های توانایی", [
                    data.marketingInterest.b2b && "B2B",
                    data.marketingInterest.retail && "خرده فروشی",
                    data.marketingInterest.restaurant && "رستوران",
                    data.marketingInterest.advertising && "تبلیغاتی",
                    data.marketingInterest.internet && "اینترنتی",
                ].filter(Boolean).join(" , ")),
                createLabelValue("امکان کار در همه مناطق", data.canWorkAllZones ? "بله" : `خیر - عدم توانایی در: ${data.restrictedZonesDesc}`),

                // Section 12 & 13
                createSectionHeader("۱۲ و ۱۳. بیمه و آشنایی"),
                createLabelValue("سابقه بیمه", data.hasInsuranceHistory ? `بله - ${data.insuranceYears} سال` : "خیر"),
                createLabelValue("شماره بیمه", data.insuranceNumber),
                createLabelValue("نحوه آشنایی", data.howDidYouFindUs),

                // Section 14
                createSectionHeader("۱۴. ضامن‌ها"),
                createTable(
                    ["نام", "نسبت", "شغل", "نشانی", "تلفن"],
                    data.guarantors.map((g: Guarantor) => [
                        g.name, g.relation, g.job, g.address, g.phone
                    ])
                ),

                // Section 15, 16, 17, 18
                createSectionHeader("۱۵ تا ۱۸. شرایط شغلی"),
                createLabelValue("نوع تضمین", data.guaranteeType === 'promissory_govt' ? "سفته با ضامن دولتی" : data.guaranteeType === 'promissory_market' ? "سفته با ضامن بازاری" : data.guaranteeTypeOther),
                createLabelValue("شاغل فعلی", data.currentlyEmployed ? `بله - ${data.currentEmploymentDesc}` : "خیر"),
                createLabelValue("مأموریت شهرستان", data.willingToRelocate),
                createLabelValue("حقوق درخواستی", data.expectedSalary),
                createLabelValue("ترجیح حقوق", data.salaryPreference === 'fixed' ? "ثابت" : data.salaryPreference === 'commission' ? "پورسانت" : "ترکیبی"),

                // Section 19
                createSectionHeader("۱۹. افراد تحت تکفل"),
                createLabelValue("سرپرست خانواده هستید؟", data.isHeadOfHousehold),
                createTable(
                    ["نام", "نسبت", "جنسیت", "شغل", "تولد", "کدملی"],
                    data.familyMembers.map((f: FamilyMember) => [
                        f.name, f.relation, f.gender, f.job, f.birthDate, f.nationalId
                    ])
                ),

                // Section 20
                createSectionHeader("۲۰. آدرس و تماس"),
                createLabelValue("وضعیت مسکن", data.homeType === 'owned' ? "شخصی" : data.homeType === 'rented' ? "اجاره" : data.homeType === 'parents' ? "منزل والدین" : "سایر"),
                createLabelValue("آدرس", data.address),
                createLabelValue("کد پستی", data.postalCode),
                createLabelValue("تلفن ثابت", data.phoneFixed),
                createLabelValue("موبایل", data.mobile),
                createLabelValue("تلفن اضطراری", data.phoneEmergency),

                new Paragraph({
                    text: "صحت کلیه اطلاعات مندرج در این فرم را تأیید و گواهی می‌نمایم.",
                    bold: true,
                    rightToLeft: true,
                    bidirectional: true,
                    spacing: { before: 400 }
                }),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    const fileName = `${data.firstName || 'Form'}_${data.lastName || 'Estekhdam'}.docx`;
    
    // Handle file saver import discrepancy
    // @ts-ignore
    const saveAs = FileSaver.saveAs || FileSaver;
    saveAs(blob, fileName);
};
