function add() {
    var SerialNumber = document.getElementById("SerialNumber").value;
    var Software = document.getElementById("Software").value;
    var PurchaseDate = document.getElementById("PurchaseDate").value;
    var ExpiryDate = document.getElementById("ExpiryDate").value;

    // Creating an object to store the license information
    var license = {
        SerialNumber: SerialNumber,
        Software: Software,
        PurchaseDate: PurchaseDate,
        ExpiryDate: ExpiryDate
    };

    // Storing the license information in local storage
    if (localStorage.getItem('licenses') === null) {
        localStorage.setItem('licenses', JSON.stringify([license]));
    } else {
        var licenses = JSON.parse(localStorage.getItem('licenses'));
        licenses.push(license);
        localStorage.setItem('licenses', JSON.stringify(licenses));
    }

    // Redirecting to the ClientPage.html after adding the license
    window.location.href = 'ClientPage.html';
}
function removeLicense() {
    var licenses = JSON.parse(localStorage.getItem('licenses'));
    var selectedLicenseIndex = document.querySelector('input[name="LicenseChoice"]:checked').value;

    if (selectedLicenseIndex !== undefined) {
        licenses.splice(selectedLicenseIndex, 1);
        localStorage.setItem('licenses', JSON.stringify(licenses));
    }

    // Redirecting to the ClientPage.html after removing the license
    window.location.href = 'ClientPage.html';
}

function renewLicense() {
    var licenses = JSON.parse(localStorage.getItem('licenses'));
    var selectedLicenseIndex = document.getElementById('LicenseChoice').value;
    var renewalTime = document.getElementById('renewalTime').value;

    if (selectedLicenseIndex !== undefined) {
        var selectedLicense = licenses[selectedLicenseIndex];
        var newExpiryDate = new Date(selectedLicense.ExpiryDate);
        newExpiryDate.setFullYear(newExpiryDate.getFullYear() + parseInt(renewalTime));

        selectedLicense.ExpiryDate = newExpiryDate.toISOString().split('T')[0];
        localStorage.setItem('licenses', JSON.stringify(licenses));
    }

    // Redirecting to the ClientPage.html after renewing the license
    window.location.href = 'ClientPage.html';
}


function sidebarUnfocus() {
	var isOpen = document.getElementById("sidebar").classList.contains("open");
	if (isOpen == true) {
	
		document.getElementById("sidebar").classList.toggle("open");
		document.getElementById("header").classList.toggle("sidebaropen");
		const elements = document.getElementsByClassName("background-container");

		for (let i = 0; i < elements.length; i++) {
			elements[i].classList.toggle("sidebaropen");
		}
	}
}


window.onload = function() {
			const elements = document.getElementsByClassName("background-container");

				for (let i = 0; i < elements.length; i++) {
					elements[i].addEventListener("click",sidebarUnfocus);
				}
		
		}
		
		
		
function toggleSidebar() {
			document.getElementById("sidebar").classList.toggle("open");

            var isOpen = document.getElementById("sidebar").classList.contains("open");


            document.getElementById("header").classList.toggle("sidebaropen");

            const elements = document.getElementsByClassName("background-content");

            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.toggle("sidebaropen");
            }

        }

