document.getElementById("createButton").addEventListener("click", function() {
  const domain = document.getElementById("domain-create").value;
  const routeTo = document.getElementById("route-to").value;
  const type = document.getElementById("type").value;

  // Make a POST request to create a new record
  fetch("http://localhost:3000/create-dns-record/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ domain, recordType: type, value: routeTo }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Create Record Response:', data);
  
    // After successful creation, refresh the table
    document.getElementById("refreshButton").click();
  })
  .catch(error => console.error('Error creating record:', error));  
});


document.getElementById("table_body").addEventListener("click", function(e) {
  if (e.target && e.target.id == "delete-link") {
    const recordName = e.target.parentElement.parentElement.children[1].textContent;
    const recordType = e.target.parentElement.parentElement.children[3].textContent;

    const hostedZoneId = "Z00525512VLUPBPYG2DY4";

    // Make a DELETE request to delete the record
    fetch(`http://localhost:3000/delete-dns-record/?hostedZoneId=${hostedZoneId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recordName, recordType, hostedZoneId }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Delete Record Response:', data);
    
      // After successful deletion, refresh the table
      document.getElementById("refreshButton").click();
    })
    .catch(error => console.error('Error deleting record:', error));
  }
});





document.getElementById("refreshButton").addEventListener("click", function() {
  fetch("http://localhost:3000/get-dns-records?hostedZoneId=Z00525512VLUPBPYG2DY4")
    .then((data) => data.json())
    .then((responseData) => {
      const objectData = responseData.records;
      if (Array.isArray(objectData)) {
        let tableData = "";
        let i = 1;
        objectData.forEach((values) => {
          const multipleValues = values.Value.split(',');
          const joinedValues = multipleValues.join('<br>');
          tableData += `<tr><td>${i}</td><td>${values.Name}</td><td>${joinedValues}</td><td>${values.Type}</td><td><a id="delete-link" href="#">Delete</a></td></tr>`;
          i++;
        });
        document.getElementById("table_body").innerHTML = tableData;
      } else {
        console.error('Unexpected data format:', responseData);
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
});





fetch("http://localhost:3000/get-dns-records")
  .then((data) => {
    return data.json();
  })
  .then((responseData) => {
    // Access the 'records' array
    const objectData = responseData.records;

    // Verifing that objectData is an array before using map
    if (Array.isArray(objectData)) {
      let tableData = "";
      let i = 1;
      objectData.forEach((values) => {
        
        const multipleValues = values.Value.split(',');
        
        // Joining the values with line breaks within a single cell
        const joinedValues = multipleValues.join('<br>');
        
        
        tableData += `<tr><td>${i}</td><td>${values.Name}</td><td>${joinedValues}</td><td>${values.Type}</td><td><a id="delete-link" href="#">Delete</a></td></tr>`;
        i++
      });
      document.getElementById("table_body").innerHTML = tableData;
    } else {
      console.error('Unexpected data format:', responseData);
    }
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });
