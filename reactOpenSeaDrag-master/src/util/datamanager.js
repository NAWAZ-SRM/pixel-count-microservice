
const fetchData = async (pathT, method, contentType) => {
    const path = `http://34.28.249.83:5000/${pathT}`; // Replace with your API path
    // const method = 'GET'; // Replace with your method
    const body = {}; // Replace with your body

    return new Promise((resolve, reject) => {
      fetch(path, {
        method: method,
        headers: {
        //   'Content-Type': 'application/json'
          'Content-Type': contentType
        }
      })

        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response;
        })
        .then((data) => {

            if(contentType === 'application/json'){

                resolve(data.json())
            }else{
                resolve(data);
            }

          
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation: ', error);
          reject(error);
        });
    });
  }


  export default {fetchData}
