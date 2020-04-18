const  request = require('supertest');
const	app = require('../../app/index');
let server = app.app.listen(10002);
let ignoreList = [
	'/upload'
];
// eslint-disable-next-line no-undef
describe('#test server',function(){
	// eslint-disable-next-line no-undef
	it('#test some Api',async function(){
		app.restfulapi.forEach(async el=>{
			if(!ignoreList.includes(el.path) && el.type==='get'){
				console.log(el);
				await request(server).get(el.path).expect(200);
			}
		});
		// await request(server).get('/sky').expect(200,'/sky');
	});
});
