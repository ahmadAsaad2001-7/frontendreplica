import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface ClinicProfileData {
    clinicName: string;
    doctorName: string;
    specialty: string;
    phone: string;
    address: string;
    licenseNumber: string;
    logo?: string; // dataURL
}

export const useClinicProfileStore = defineStore('clinicProfile', () => {
    const clinicName = ref('عيادة د. طارق الحكيم');
    const doctorName = ref('د. طارق الحكيم');
    const specialty = ref('استشاري جراحة العظام والعمود الفقري');
    const phone = ref('966+ 123 50 4567');
    const address = ref('الرياض، حي العليا');
    const licenseNumber = ref('1010203030');
    const logo = ref('');

    // ✅ لا alert داخل الـ store — التغذية الراجعة مسؤولية الواجهة
    function updateProfile(data: ClinicProfileData) {
        clinicName.value = data.clinicName;
        doctorName.value = data.doctorName;
        specialty.value = data.specialty;
        phone.value = data.phone;
        address.value = data.address;
        licenseNumber.value = data.licenseNumber;
        if (data.logo !== undefined) logo.value = data.logo;
    }

    return { clinicName, doctorName, specialty, phone, address, licenseNumber, logo, updateProfile };
});
