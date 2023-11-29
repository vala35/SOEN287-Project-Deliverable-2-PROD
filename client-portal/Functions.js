
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

            const elements = document.getElementsByClassName("background-container");

            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.toggle("sidebaropen");
            }

        }

