import React, { useState } from 'react';
import { Download, Plus, Trash2, FileText } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Input, TextArea, Select, Checkbox, Section, Button } from './components/ui';
import { FormData, EducationRecord, WorkExperience, TrainingCourse, Guarantor, FamilyMember } from './types';
import { INITIAL_DATA } from './constants';
import { generateWordDocument } from './services/wordGenerator';

function App() {
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [isGenerating, setIsGenerating] = useState(false);

  const update = (field: keyof FormData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateNested = (parent: keyof FormData, key: string, value: any) => {
    setData(prev => ({
      ...prev,
      [parent]: { ...prev[parent] as object, [key]: value }
    }));
  };

  const handleDownload = async () => {
    if (!data.firstName || !data.lastName) {
      alert("لطفاً حداقل نام و نام خانوادگی را وارد کنید.");
      return;
    }
    setIsGenerating(true);
    try {
      await generateWordDocument(data);
    } catch (e) {
      console.error(e);
      alert("خطا در تولید فایل");
    }
    setIsGenerating(false);
  };

  // Helper to manage array fields
  const addArrayItem = <T extends { id: string }>(field: keyof FormData, initialItem: Omit<T, 'id'>) => {
    const newItem = { ...initialItem, id: uuidv4() } as T;
    setData(prev => ({ ...prev, [field]: [...(prev[field] as unknown as T[]), newItem] }));
  };

  const removeArrayItem = (field: keyof FormData, id: string) => {
    setData(prev => ({ ...prev, [field]: (prev[field] as any[]).filter(item => item.id !== id) }));
  };

  const updateArrayItem = (field: keyof FormData, id: string, key: string, value: any) => {
    setData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map(item => item.id === id ? { ...item, [key]: value } : item)
    }));
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-blue-900 text-white py-6 px-4 shadow-lg sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">فرم درخواست استخدام</h1>
            <p className="text-blue-200 text-sm">شرکت آراز پخش تنکا</p>
          </div>
          <Button onClick={handleDownload} variant="secondary" disabled={isGenerating}>
             {isGenerating ? 'در حال ساخت...' : 'دانلود فایل Word'}
             <Download size={18} />
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 mt-6 space-y-6">
        
        <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
           <Input 
             label="عنوان شغلی مورد نظر" 
             value={data.targetJobTitle} 
             onChange={e => update('targetJobTitle', e.target.value)} 
             placeholder="مثلاً: کارشناس فروش"
             className="text-lg"
           />
        </div>

        <Section title="۱- اطلاعات شخصی">
          <Input label="نام" value={data.firstName} onChange={e => update('firstName', e.target.value)} />
          <Input label="نام خانوادگی" value={data.lastName} onChange={e => update('lastName', e.target.value)} />
          <Input label="نام پدر" value={data.fatherName} onChange={e => update('fatherName', e.target.value)} />
          <Input label="شماره شناسنامه" value={data.idNumber} onChange={e => update('idNumber', e.target.value)} />
          <Input label="تاریخ تولد (روز/ماه/سال)" value={data.birthDate} onChange={e => update('birthDate', e.target.value)} placeholder="1370/01/01" />
          <Input label="کد ملی" value={data.nationalId} onChange={e => update('nationalId', e.target.value)} />
          <Input label="محل صدور" value={data.issuePlace} onChange={e => update('issuePlace', e.target.value)} />
          <Input label="محل تولد" value={data.birthPlace} onChange={e => update('birthPlace', e.target.value)} />
          <Input label="دین (مذهب)" value={data.religion} onChange={e => update('religion', e.target.value)} />
          <Select label="وضعیت تأهل" options={[{value: 'single', label: 'مجرد'}, {value: 'married', label: 'متأهل'}, {value: 'divorced', label: 'مطلقه'}]} value={data.maritalStatus} onChange={e => update('maritalStatus', e.target.value)} />
          <Input label="تعداد فرزند دختر" type="number" value={data.childrenCountDaughter} onChange={e => update('childrenCountDaughter', e.target.value)} />
          <Input label="تعداد فرزند پسر" type="number" value={data.childrenCountSon} onChange={e => update('childrenCountSon', e.target.value)} />
          
          <div className="md:col-span-2 border-t pt-4 mt-2">
             <h4 className="font-bold text-gray-700 mb-3">وضعیت سلامت</h4>
             <div className="grid md:grid-cols-2 gap-4">
               <Select label="وضعیت کلی" options={[{value: 'healthy', label: 'سالم هستم'}, {value: 'unhealthy', label: 'مشکل دارم'}]} value={data.healthStatus} onChange={e => update('healthStatus', e.target.value)} />
               <Input label="گروه خونی" value={data.bloodType} onChange={e => update('bloodType', e.target.value)} placeholder="O+, A- ..." />
               <TextArea label="در صورت داشتن بیماری توضیح دهید" className="md:col-span-2" value={data.medicalConditionDescription} onChange={e => update('medicalConditionDescription', e.target.value)} />
               <TextArea label="آیا داروی خاصی مصرف میکنید؟" className="md:col-span-2" value={data.medicationDescription} onChange={e => update('medicationDescription', e.target.value)} />
               <Input label="سابقه بیماری" value={data.medicalHistory} onChange={e => update('medicalHistory', e.target.value)} />
               <Input label="سابقه جراحی" value={data.surgeryHistory} onChange={e => update('surgeryHistory', e.target.value)} />
             </div>
          </div>
        </Section>

        <Section title="۲- خدمت نظام وظیفه">
           <Select 
             label="وضعیت خدمت" 
             options={[{value: 'done', label: 'انجام داده'}, {value: 'not_done', label: 'انجام نداده'}, {value: 'exempt', label: 'معاف'}]} 
             value={data.militaryStatus} 
             onChange={e => update('militaryStatus', e.target.value)} 
           />
           {data.militaryStatus === 'exempt' && (
             <Input label="نوع و علت معافیت" value={data.exemptionReason} onChange={e => update('exemptionReason', e.target.value)} />
           )}
        </Section>

        <Section title="۳- سوابق تحصیلی و آموزشی">
           <div className="md:col-span-2 space-y-4">
             {data.educationHistory.map((edu, index) => (
               <div key={edu.id} className="p-4 bg-gray-50 rounded border relative grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button onClick={() => removeArrayItem('educationHistory', edu.id)} className="absolute top-2 left-2 text-red-500"><Trash2 size={18}/></button>
                  <Input label="مدرک تحصیلی" value={edu.degree} onChange={e => updateArrayItem('educationHistory', edu.id, 'degree', e.target.value)} />
                  <Input label="رشته" value={edu.major} onChange={e => updateArrayItem('educationHistory', edu.id, 'major', e.target.value)} />
                  <Input label="معدل کل" value={edu.gpa} onChange={e => updateArrayItem('educationHistory', edu.id, 'gpa', e.target.value)} />
                  <Input label="تاریخ پایان" value={edu.endDate} onChange={e => updateArrayItem('educationHistory', edu.id, 'endDate', e.target.value)} />
                  <Input label="نوع دانشگاه" value={edu.universityType} onChange={e => updateArrayItem('educationHistory', edu.id, 'universityType', e.target.value)} />
                  <Input label="نام موسسه" value={edu.instituteName} onChange={e => updateArrayItem('educationHistory', edu.id, 'instituteName', e.target.value)} />
                  <Input label="شهر" value={edu.city} onChange={e => updateArrayItem('educationHistory', edu.id, 'city', e.target.value)} />
               </div>
             ))}
             <Button variant="outline" onClick={() => addArrayItem('educationHistory', { degree: '', major: '', gpa: '', endDate: '', universityType: '', instituteName: '', city: '' })} >
               <Plus size={16} /> افزودن سابقه تحصیلی
             </Button>
           </div>
        </Section>

        <Section title="۴- تجربیات شغلی">
          <div className="md:col-span-2 space-y-4">
             {data.workHistory.map((work, index) => (
               <div key={work.id} className="p-4 bg-gray-50 rounded border relative grid grid-cols-1 md:grid-cols-4 gap-3">
                  <button onClick={() => removeArrayItem('workHistory', work.id)} className="absolute top-2 left-2 text-red-500"><Trash2 size={18}/></button>
                  <Input label="نام سازمان" value={work.organization} onChange={e => updateArrayItem('workHistory', work.id, 'organization', e.target.value)} />
                  <Input label="سمت / شغل" value={work.role} onChange={e => updateArrayItem('workHistory', work.id, 'role', e.target.value)} />
                  <Input label="مدت همکاری" value={work.duration} onChange={e => updateArrayItem('workHistory', work.id, 'duration', e.target.value)} />
                  <Input label="تاریخ قطع همکاری" value={work.endDate} onChange={e => updateArrayItem('workHistory', work.id, 'endDate', e.target.value)} />
                  <Input label="تلفن" value={work.phone} onChange={e => updateArrayItem('workHistory', work.id, 'phone', e.target.value)} />
                  <Input label="متوسط حقوق" value={work.salary} onChange={e => updateArrayItem('workHistory', work.id, 'salary', e.target.value)} />
                  <Input label="علت ترک خدمت" className="md:col-span-2" value={work.reasonForLeaving} onChange={e => updateArrayItem('workHistory', work.id, 'reasonForLeaving', e.target.value)} />
               </div>
             ))}
             <Button variant="outline" onClick={() => addArrayItem('workHistory', { organization: '', role: '', duration: '', endDate: '', phone: '', salary: '', reasonForLeaving: '' })} >
               <Plus size={16} /> افزودن سابقه شغلی
             </Button>
           </div>
        </Section>

        <Section title="۵ و ۶- سوابق و عادات">
           <div className="md:col-span-2 grid gap-4">
             <div className="flex items-center gap-4">
               <span className="text-sm font-bold">آیا سابقه کیفری یا بازداشتی دارید؟</span>
               <Checkbox label="بله" checked={data.criminalRecord} onChange={e => update('criminalRecord', e.target.checked)} />
               <Checkbox label="خیر" checked={!data.criminalRecord} onChange={e => update('criminalRecord', !e.target.checked)} />
             </div>
             {data.criminalRecord && <Input label="علت را ذکر کنید" value={data.criminalRecordDesc} onChange={e => update('criminalRecordDesc', e.target.value)} />}
             
             <div className="flex items-center gap-4 mt-4">
               <span className="text-sm font-bold">آیا سیگار یا مواد مخدر مصرف میکنید؟</span>
               <Checkbox label="بله" checked={data.smokingDrugs} onChange={e => update('smokingDrugs', e.target.checked)} />
               <Checkbox label="خیر" checked={!data.smokingDrugs} onChange={e => update('smokingDrugs', !e.target.checked)} />
             </div>
           </div>
        </Section>

        <Section title="۷- مهارت‌ها">
           <div className="md:col-span-2">
             <h4 className="font-bold mb-2">زبان انگلیسی</h4>
             <div className="grid grid-cols-3 gap-4 mb-6">
               <Select label="خواندن" options={[{value: 'weak', label: 'ضعیف'}, {value: 'medium', label: 'متوسط'}, {value: 'good', label: 'خوب'}, {value: 'excellent', label: 'عالی'}]} value={data.langEnglishRead} onChange={e => update('langEnglishRead', e.target.value)} />
               <Select label="نوشتن" options={[{value: 'weak', label: 'ضعیف'}, {value: 'medium', label: 'متوسط'}, {value: 'good', label: 'خوب'}, {value: 'excellent', label: 'عالی'}]} value={data.langEnglishWrite} onChange={e => update('langEnglishWrite', e.target.value)} />
               <Select label="مکالمه" options={[{value: 'weak', label: 'ضعیف'}, {value: 'medium', label: 'متوسط'}, {value: 'good', label: 'خوب'}, {value: 'excellent', label: 'عالی'}]} value={data.langEnglishSpeak} onChange={e => update('langEnglishSpeak', e.target.value)} />
             </div>

             <h4 className="font-bold mb-2">کامپیوتر</h4>
             <div className="flex flex-wrap gap-4 mb-6">
               {Object.keys(data.computerSkills).map(key => (
                 <Checkbox 
                   key={key} 
                   label={key.charAt(0).toUpperCase() + key.slice(1)} 
                   checked={(data.computerSkills as any)[key]} 
                   onChange={e => updateNested('computerSkills', key, e.target.checked)} 
                 />
               ))}
             </div>

             <h4 className="font-bold mb-2">دوره‌های آموزشی</h4>
             <div className="space-y-3">
               {data.trainingCourses.map((tc) => (
                 <div key={tc.id} className="p-3 bg-gray-50 border rounded grid grid-cols-1 md:grid-cols-6 gap-2 relative">
                    <button onClick={() => removeArrayItem('trainingCourses', tc.id)} className="absolute top-1 left-1 text-red-500"><Trash2 size={14}/></button>
                    <Input placeholder="نام دوره" value={tc.name} onChange={e => updateArrayItem('trainingCourses', tc.id, 'name', e.target.value)} />
                    <Input placeholder="موسسه" value={tc.institute} onChange={e => updateArrayItem('trainingCourses', tc.id, 'institute', e.target.value)} />
                    <Input placeholder="مدت" value={tc.duration} onChange={e => updateArrayItem('trainingCourses', tc.id, 'duration', e.target.value)} />
                    <Input placeholder="تاریخ" value={tc.startDate} onChange={e => updateArrayItem('trainingCourses', tc.id, 'startDate', e.target.value)} />
                    <div className="flex items-center"><Checkbox label="مدرک دارد" checked={tc.hasCertificate} onChange={e => updateArrayItem('trainingCourses', tc.id, 'hasCertificate', e.target.checked)} /></div>
                    <Input placeholder="توضیحات" value={tc.description} onChange={e => updateArrayItem('trainingCourses', tc.id, 'description', e.target.value)} />
                 </div>
               ))}
                <Button variant="outline" onClick={() => addArrayItem('trainingCourses', { name: '', institute: '', duration: '', startDate: '', hasCertificate: false, description: '' })} >
                  <Plus size={16} /> افزودن دوره
                </Button>
             </div>
           </div>
        </Section>

        <Section title="۸- فعالیت‌های درخواستی">
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
               <Checkbox label="کارمند اداری" checked={data.jobTypes.admin} onChange={e => updateNested('jobTypes', 'admin', e.target.checked)} />
               <Checkbox label="بازاریابی تلفنی" checked={data.jobTypes.phoneSales} onChange={e => updateNested('jobTypes', 'phoneSales', e.target.checked)} />
               <Checkbox label="بازاریابی حضوری" checked={data.jobTypes.fieldSales} onChange={e => updateNested('jobTypes', 'fieldSales', e.target.checked)} />
               <Checkbox label="توزیع کننده" checked={data.jobTypes.distributor} onChange={e => updateNested('jobTypes', 'distributor', e.target.checked)} />
               <Checkbox label="امور مالی" checked={data.jobTypes.finance} onChange={e => updateNested('jobTypes', 'finance', e.target.checked)} />
               <Checkbox label="منشی" checked={data.jobTypes.secretary} onChange={e => updateNested('jobTypes', 'secretary', e.target.checked)} />
               <Checkbox label="نیروی خدماتی" checked={data.jobTypes.service} onChange={e => updateNested('jobTypes', 'service', e.target.checked)} />
               <Checkbox label="کارگر انبار" checked={data.jobTypes.warehouse} onChange={e => updateNested('jobTypes', 'warehouse', e.target.checked)} />
               <Checkbox label="راننده" checked={data.jobTypes.driver} onChange={e => updateNested('jobTypes', 'driver', e.target.checked)} />
               <Checkbox label="هر کاری" checked={data.jobTypes.anything} onChange={e => updateNested('jobTypes', 'anything', e.target.checked)} />
            </div>
            {data.jobTypes.driver && <Input label="نوع گواهینامه" value={data.driverLicenseType} onChange={e => update('driverLicenseType', e.target.value)} />}
            <Input label="مدارک مرتبط با شغل" className="md:col-span-2" value={data.relevantDocs} onChange={e => update('relevantDocs', e.target.value)} />
        </Section>

        <Section title="۹ تا ۱۳- اطلاعات تکمیلی">
           <Select label="نحوه همکاری" options={[{value: 'full_time', label: 'تمام وقت'}, {value: 'part_time', label: 'پاره وقت'}, {value: 'remote', label: 'دورکاری'}]} value={data.cooperationType} onChange={e => update('cooperationType', e.target.value)} />
           
           <div className="flex flex-col gap-2">
             <Checkbox label="قادر به انجام اضافه کاری هستید؟" checked={data.canOvertime} onChange={e => update('canOvertime', e.target.checked)} />
             {data.canOvertime && <Input placeholder="چند ساعت؟" value={data.overtimeHours} onChange={e => update('overtimeHours', e.target.value)} />}
           </div>

           <Checkbox label="قادر به کار در تعطیلات هستید؟" checked={data.canWeekends} onChange={e => update('canWeekends', e.target.checked)} />
           
           <Select label="روحیه کار تیمی" options={[{value: 'good', label: 'خوب'}, {value: 'medium', label: 'متوسط'}, {value: 'weak', label: 'ضعیف'}]} value={data.teamwork} onChange={e => update('teamwork', e.target.value)} />
           <TextArea label="علایق" value={data.interests} onChange={e => update('interests', e.target.value)} />
           
           <div className="md:col-span-2">
             <Checkbox label="آیا با چالش‌های شخصی/خانوادگی مواجه هستید؟" checked={data.personalChallenges} onChange={e => update('personalChallenges', e.target.checked)} />
             {data.personalChallenges && <Input label="توضیح" value={data.personalChallengesDesc} onChange={e => update('personalChallengesDesc', e.target.value)} />}
           </div>

           <Input label="درونگرا / برونگرا؟" value={data.introvertExtrovert} onChange={e => update('introvertExtrovert', e.target.value)} />
           <Input label="ویژگی متمایز شما؟" value={data.uniqueTraits} onChange={e => update('uniqueTraits', e.target.value)} />
           
           <div className="md:col-span-2 border-t mt-4 pt-4">
              <h4 className="font-bold mb-2">زمینه بازاریابی</h4>
              <div className="flex flex-wrap gap-4">
                 <Checkbox label="B2B" checked={data.marketingInterest.b2b} onChange={e => updateNested('marketingInterest', 'b2b', e.target.checked)} />
                 <Checkbox label="خرده فروشی" checked={data.marketingInterest.retail} onChange={e => updateNested('marketingInterest', 'retail', e.target.checked)} />
                 <Checkbox label="رستوران" checked={data.marketingInterest.restaurant} onChange={e => updateNested('marketingInterest', 'restaurant', e.target.checked)} />
                 <Checkbox label="تبلیغاتی" checked={data.marketingInterest.advertising} onChange={e => updateNested('marketingInterest', 'advertising', e.target.checked)} />
                 <Checkbox label="اینترنتی" checked={data.marketingInterest.internet} onChange={e => updateNested('marketingInterest', 'internet', e.target.checked)} />
              </div>
           </div>

           <div className="md:col-span-2 mt-4">
             <Checkbox label="در همه مناطق کاری شرکت می‌توانید کار کنید؟" checked={data.canWorkAllZones} onChange={e => update('canWorkAllZones', e.target.checked)} />
             {!data.canWorkAllZones && <Input label="در کدام مناطق نمیتوانید؟ چرا؟" value={data.restrictedZonesDesc} onChange={e => update('restrictedZonesDesc', e.target.value)} />}
           </div>

           <Checkbox label="سابقه بیمه دارید؟" checked={data.hasInsuranceHistory} onChange={e => update('hasInsuranceHistory', e.target.checked)} />
           {data.hasInsuranceHistory && (
              <>
                <Input label="چند سال؟" value={data.insuranceYears} onChange={e => update('insuranceYears', e.target.value)} />
                <Input label="شماره بیمه" value={data.insuranceNumber} onChange={e => update('insuranceNumber', e.target.value)} />
              </>
           )}
           
           <Input label="نحوه آشنایی با شرکت" className="md:col-span-2" value={data.howDidYouFindUs} onChange={e => update('howDidYouFindUs', e.target.value)} />
        </Section>

        <Section title="۱۴- ضامن‌ها">
           <div className="md:col-span-2 space-y-4">
             {data.guarantors.map((g) => (
                <div key={g.id} className="p-4 bg-gray-50 rounded border relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  <button onClick={() => removeArrayItem('guarantors', g.id)} className="absolute top-2 left-2 text-red-500"><Trash2 size={18}/></button>
                  <Input label="نام و نام خانوادگی" value={g.name} onChange={e => updateArrayItem('guarantors', g.id, 'name', e.target.value)} />
                  <Input label="نسبت" value={g.relation} onChange={e => updateArrayItem('guarantors', g.id, 'relation', e.target.value)} />
                  <Input label="شغل" value={g.job} onChange={e => updateArrayItem('guarantors', g.id, 'job', e.target.value)} />
                  <Input label="نشانی" value={g.address} onChange={e => updateArrayItem('guarantors', g.id, 'address', e.target.value)} />
                  <Input label="تلفن" value={g.phone} onChange={e => updateArrayItem('guarantors', g.id, 'phone', e.target.value)} />
                </div>
             ))}
             <Button variant="outline" onClick={() => addArrayItem('guarantors', { name: '', relation: '', job: '', address: '', phone: '' })} >
               <Plus size={16} /> افزودن ضامن
             </Button>
           </div>
        </Section>

        <Section title="۱۵ تا ۱۹- تضمین و حقوق">
           <div className="md:col-span-2">
             <h4 className="font-bold mb-2">تضمین کاری</h4>
             <div className="space-y-2">
               <div className="flex items-center gap-2">
                  <input type="radio" name="guarantee" checked={data.guaranteeType === 'promissory_govt'} onChange={() => update('guaranteeType', 'promissory_govt')} />
                  <label>سفته یا چک با تایید ضامن کارمند دولت</label>
               </div>
               <div className="flex items-center gap-2">
                  <input type="radio" name="guarantee" checked={data.guaranteeType === 'promissory_market'} onChange={() => update('guaranteeType', 'promissory_market')} />
                  <label>سفته یا چک با تایید ضامن بازاری</label>
               </div>
               <div className="flex items-center gap-2">
                  <input type="radio" name="guarantee" checked={data.guaranteeType === 'other'} onChange={() => update('guaranteeType', 'other')} />
                  <label>سایر: </label>
                  <Input className="w-64 inline-block ml-2" value={data.guaranteeTypeOther} onChange={e => update('guaranteeTypeOther', e.target.value)} disabled={data.guaranteeType !== 'other'} />
               </div>
             </div>
           </div>

           <div className="md:col-span-2 mt-4">
              <Checkbox label="اکنون مشغول به کار هستید؟" checked={data.currentlyEmployed} onChange={e => update('currentlyEmployed', e.target.checked)} />
              {data.currentlyEmployed && <Input label="توضیح نوع و محل کار" value={data.currentEmploymentDesc} onChange={e => update('currentEmploymentDesc', e.target.value)} />}
           </div>

           <Checkbox label="حاضر به مأموریت شهرستان هستید؟" checked={data.willingToRelocate} onChange={e => update('willingToRelocate', e.target.checked)} />
           <Input label="حقوق مورد انتظار (تومان)" value={data.expectedSalary} onChange={e => update('expectedSalary', e.target.value)} />
           
           <div className="md:col-span-2">
             <h4 className="font-bold mb-2">ترجیح دریافتی</h4>
             <div className="flex gap-4">
               <label className="flex items-center gap-2"><input type="radio" checked={data.salaryPreference === 'fixed'} onChange={() => update('salaryPreference', 'fixed')} /> حقوق ثابت</label>
               <label className="flex items-center gap-2"><input type="radio" checked={data.salaryPreference === 'commission'} onChange={() => update('salaryPreference', 'commission')} /> پورسانت</label>
               <label className="flex items-center gap-2"><input type="radio" checked={data.salaryPreference === 'mixed'} onChange={() => update('salaryPreference', 'mixed')} /> ترکیبی</label>
             </div>
           </div>
        </Section>

        <Section title="افراد تحت تکفل">
           <Checkbox label="آیا سرپرست خانواده هستید؟" checked={data.isHeadOfHousehold} onChange={e => update('isHeadOfHousehold', e.target.checked)} />
           <div className="md:col-span-2 space-y-4 mt-2">
             {data.familyMembers.map((fam) => (
               <div key={fam.id} className="p-3 bg-gray-50 border rounded grid grid-cols-1 md:grid-cols-6 gap-2 relative">
                 <button onClick={() => removeArrayItem('familyMembers', fam.id)} className="absolute top-1 left-1 text-red-500"><Trash2 size={14}/></button>
                 <Input placeholder="نام" value={fam.name} onChange={e => updateArrayItem('familyMembers', fam.id, 'name', e.target.value)} />
                 <Input placeholder="جنسیت" value={fam.gender} onChange={e => updateArrayItem('familyMembers', fam.id, 'gender', e.target.value)} />
                 <Input placeholder="نسبت" value={fam.relation} onChange={e => updateArrayItem('familyMembers', fam.id, 'relation', e.target.value)} />
                 <Input placeholder="شغل" value={fam.job} onChange={e => updateArrayItem('familyMembers', fam.id, 'job', e.target.value)} />
                 <Input placeholder="تولد" value={fam.birthDate} onChange={e => updateArrayItem('familyMembers', fam.id, 'birthDate', e.target.value)} />
                 <Input placeholder="کد ملی" value={fam.nationalId} onChange={e => updateArrayItem('familyMembers', fam.id, 'nationalId', e.target.value)} />
               </div>
             ))}
              <Button variant="outline" onClick={() => addArrayItem('familyMembers', { name: '', gender: '', relation: '', job: '', birthDate: '', nationalId: '', phone: '' })} >
                <Plus size={16} /> افزودن عضو خانواده
              </Button>
           </div>
        </Section>

        <Section title="۲۰- آدرس و تماس">
           <Select label="وضعیت سکونت" options={[{value: 'owned', label: 'منزل شخصی'}, {value: 'rented', label: 'اجاره'}, {value: 'parents', label: 'منزل والدین'}, {value: 'other', label: 'سایر'}]} value={data.homeType} onChange={e => update('homeType', e.target.value)} />
           <TextArea label="آدرس دقیق" className="md:col-span-2" value={data.address} onChange={e => update('address', e.target.value)} />
           <Input label="کد پستی" value={data.postalCode} onChange={e => update('postalCode', e.target.value)} />
           <Input label="تلفن ثابت" value={data.phoneFixed} onChange={e => update('phoneFixed', e.target.value)} />
           <Input label="موبایل" value={data.mobile} onChange={e => update('mobile', e.target.value)} />
           <Input label="تلفن اضطراری" value={data.phoneEmergency} onChange={e => update('phoneEmergency', e.target.value)} />
        </Section>

        <div className="flex justify-center pt-6 pb-12">
            <Button onClick={handleDownload} className="w-full md:w-1/2 text-lg py-4 bg-green-600 hover:bg-green-700" disabled={isGenerating}>
               {isGenerating ? 'در حال آماده سازی فایل...' : 'ثبت و دانلود فرم نهایی (Word)'}
               <FileText size={24} />
            </Button>
        </div>

      </div>
    </div>
  );
}

export default App;