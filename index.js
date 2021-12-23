let fs = require("fs");
var path=require('path');
let xlsx = require('node-xlsx').default;
let xml2js = require('xml2js');

let gameListFiledName="game";
let enDatFile="FinalBurn Neo (ClrMame Pro XML, Arcade only).dat";
let outDatFile="rom_set_fbn_cn.xml";

let run=async ()=>{
    let nameMap={};
    let filedRowIndex=0;
    const workSheetsFromFile = xlsx.parse(`arc_rom_set.xlsx`);
    for (const workSheet of workSheetsFromFile) {
        let data = workSheet.data;
        for (let row = filedRowIndex + 1; row < data.length; row++) {
            let rowData = data[row];
            let fileName = rowData[0];
            let gameName = rowData[1];
            let type = rowData[2];
            let year = rowData[3];
            let com = rowData[4];
            if(gameName){
                nameMap[fileName]=gameName;
            }
        }
    }


    var parser = new xml2js.Parser();
    let data =fs.readFileSync(enDatFile);
    let xmlObj = await parser.parseStringPromise(data);
    // console.log(xmlObj);
    let gameList = xmlObj.datafile[gameListFiledName];
    for(let i=0;i<gameList.length;i++) {
        let fileName = gameList[i].$.name;
        if(fileName==null){
            if(gameList[i].$.cloneof){
                fileName = gameList[i].$.cloneof;
            }
            if(gameList[i].$.romof){
                fileName = gameList[i].$.romof;
            }
        }
        
        if(nameMap[fileName]){
            gameList[i].description = [nameMap[fileName]];
        }
    }

    const builder = new xml2js.Builder();
    const xml = builder.buildObject(xmlObj); 
    // console.log(xml);
    fs.writeFileSync(outDatFile, xml);
    
}

run();

