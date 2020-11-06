const fs = require('fs')
const csv = require('csv');
const stringify = require('csv-stringify');

//https://stackabuse.com/reading-and-writing-csv-files-in-nodejs-with-node-csv/

const inputFile = 'test1.csv';
const outputFile = 'added-categories.csv'


    function readFile() {
        const output = []
        const parser = fs.createReadStream(inputFile).pipe(csv.parse({columns: true, delimiter: ';'}))
        .on('data', (dataRow) => {
            if (dataRow['sku'].length > 0) {
                const arr = [];
                arr.push(dataRow);
                output.push(arr);
            } else {
                output[output.length -1].push(dataRow)
            }
        })
        parser.on('finish', () => {
            console.log('Done 🍻');
            outDate(output)
        });
    }
    readFile()
    

    function outDate (data) {
        const newData = data.map(product => {
            // join caregoties
            let categories = product.map((item) => {
                return `Default Category/${item['_root_category']}/${item['_category']}`
            });

            product.forEach(element => { element.categories = ''});
            product[0].categories = categories.join(',')
            // join category end

            // set biggest price
            let prices = product.map((item) => {
                return Number(item['price'])
            });
            const biggestPrice = Math.max(...prices)
            // console.log(biggestPrice)
            product[0]['price'] = biggestPrice.toString()
            // set biggest price end

            // join media_images
            let mediaIamges = product.filter(item => item['_media_image'].length > 0).map(el => el['_media_image']);

            // console.log(mediaIamges)

            product[0]['additional_images'] = mediaIamges.join(',')
            // join media_images end

            return product
        });
        // console.log(newData);
        formatToOneArray(newData)
    }


    function formatToOneArray (data) {
        const newData = [];
        data.forEach(product => {
            newData.push(...product)
        });
        writeStream1(newData)
    }

    function writeStream1 (data) {
        stringify(data, {
            header: true,
            delimiter: ';'
        }, (err, output) => {
            fs.writeFile(__dirname+'/'+outputFile, output, function (err) {
                if (err) return console.log(err);
                console.log(`output > ${outputFile}`);
              });
        })
    }