import axios from 'axios';

test("deve fazer um teste", async function() {
    //given, when, then
    const input = 10
    
    const response = await axios.get('http://localhost:3000/api')
    const output = response.data

    expect(output.status).toBe("onfire");
});