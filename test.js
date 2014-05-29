var expect = require('expect.js');

describe('pilequire', ()=>{
  it("supports require()'ing jsx with es6 syntax", ()=> {
    var SomeComponent = require("./example/SomeComponent");
    expect(SomeComponent).to.be.a('function')
  });

  it("supports require()'ing regular .js files w/es6 syntax", ()=> {
    // the es6 example file is full of assertions already
    require("./example/es6");
  })
});