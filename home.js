const projects = [
    {
        name: "RoomApp -Enables seamless sharing on a same network",
        imageSrc: "images/room.png",
        detailUrl: "projectdetail.html"
    },
    {
        name: "Boardsphere -Live Group Chatting Website",
        imageSrc: "images/Homepage.png",
        detailUrl: "projectdetail.html"
    },
    // {
    //     name: "Project Pencil",
    //     imageSrc: "images/pp.png",
    //     detailUrl: "projectdetail.html"
    // },
    {
        name: "Image Compressor",
        imageSrc: "images/pp.png",
        detailUrl: "projectdetail.html"
    },
    {
        name: "File Converter",
        imageSrc: "images/fileconverter2.png",
        detailUrl: "projectdetail.html"
    },
    {
        name: "Youtube Video/Audio downloader(Any resolution)",
        imageSrc: "images/youtube.png",
        detailUrl: "projectdetail.html"
    },
    {
        name: "Ecom",
        imageSrc: "images/ecom.png",
        detailUrl: "projectdetail.html"
    },
    {
        name: "Cash-Flow Monitor",
        imageSrc: "images/cash.png",
        detailUrl: "projectdetail.html"
    },
    {
        name: "BlogSite",
        imageSrc: "images/blog.png",
        detailUrl: "projectdetail.html"
    },
    {
        name: "Epro",
        imageSrc: "images/ed.png",
        detailUrl: "projectdetail.html"
    },
    {
        name: "Chat",
        imageSrc: "images/chat.jpg",
        detailUrl: "projectdetail.html"
    }
];


document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('portfolio-container');

    projects.forEach(project => {
        const div = document.createElement('div');
        div.className = 'col-lg-4 col-md-6 portfolio-item filter-app';
        div.innerHTML = `
            <div class="portfolio-wrap">
                <img src="${project.imageSrc}" class="img-fluid" alt="${project.name}">
                <div class="portfolio-info">
                    <h4>${project.name}</h4>
                    <div class="portfolio-links">
                        <a onclick="setProjectDetails('${project.name}')"
                        style="text-decoration:underline; font-size:small;" 
                        href="projectdetail.html" 
                           data-gallery="portfolioDetailsGallery" 
                           data-glightbox="type: external" 
                           class="portfolio-details-lightbox" 
                           title="${project.name} Details">About</a>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
});

function setProjectDetails(projectName) {
    console.log("Project: " + projectName);
    sessionStorage.setItem('currentProject', projectName);
}