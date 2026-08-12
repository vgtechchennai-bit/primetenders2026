const SHEET_NAME = 'Enquiries';

function doGet() {
  return json_({ success: true, message: 'PrimeTender API is running.' });
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp','Name','Company Name','Mobile / WhatsApp',
        'Email','Service Required','Requirement Details','Status'
      ]);
      sheet.setFrozenRows(1);
    }

    sheet.appendRow([
      new Date(),
      clean_(data.name),
      clean_(data.company),
      clean_(data.mobile),
      clean_(data.email),
      clean_(data.service),
      clean_(data.details),
      'New'
    ]);

    return json_({ success:true, message:'Enquiry saved successfully.' });
  } catch (error) {
    return json_({ success:false, message:error.message || 'Server error.' });
  }
}

function clean_(value) {
  return value == null ? '' : String(value).trim();
}

function json_(object) {
  return ContentService
    .createTextOutput(JSON.stringify(object))
    .setMimeType(ContentService.MimeType.JSON);
}
