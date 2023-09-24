export class Settings {
    fetchScoresUrl = 'http://localhost:8000/Einzelrangliste.txt';

    rowsPerPage = 10;
    secondsPerPage = 12;

    //// Define which CSV format to parse.
    csvFormat = 'VereinsWK';
    //csvFormat = 'Custom';

    //// For a Custom CSV format, define the fields here.
    /*
    csvFields = [
        'Rang', 'Name Vorname', 'JG',
        'Waffe', 'Verein', 'Resultat',
        'Tiefschuss', 'Ausstich',
    ];
    */

    //// Encoding of the CSV file.
    //// Use 'utf-16' for VereinsWK.
    csvEncoding = 'utf-16';
    //csvEncoding = 'utf-8';
}
