const menuBtn=document.getElementById('menuBtn');
const mobileMenu=document.getElementById('mobileMenu');
menuBtn.addEventListener('click',()=>mobileMenu.classList.toggle('hidden'));
document.querySelectorAll('#mobileMenu a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.add('hidden')));
document.getElementById('year').textContent=new Date().getFullYear();

const form=document.getElementById('enquiryForm');
const status=document.getElementById('formStatus');
const submitBtn=document.getElementById('submitBtn');

form.addEventListener('submit',async(e)=>{
  e.preventDefault();
  const endpoint=window.PRIMETENDER_CONFIG?.APPS_SCRIPT_URL;
  const data=Object.fromEntries(new FormData(form).entries());

  status.textContent='';
  status.className='mt-3 min-h-5 text-sm';

  if(!data.mobile.trim()){
    status.textContent='Mobile / WhatsApp number is required.';
    status.classList.add('text-red-600');
    return;
  }

  if(!endpoint){
    status.textContent='Please configure the Google Apps Script URL in config.js.';
    status.classList.add('text-red-600');
    return;
  }

  submitBtn.disabled=true;
  submitBtn.innerHTML='Submitting...';

  try{
    const response=await fetch(endpoint,{
      method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify(data)
    });
    const result=await response.json();
    if(!result.success) throw new Error(result.message||'Unable to save enquiry.');

    form.reset();
    status.textContent='Thank you. Your enquiry has been submitted successfully.';
    status.classList.add('text-emerald-600');
  }catch(error){
    status.textContent=error.message||'Something went wrong. Please try again.';
    status.classList.add('text-red-600');
  }finally{
    submitBtn.disabled=false;
    submitBtn.innerHTML='Send Enquiry <span class="ml-1">→</span>';
  }
});
