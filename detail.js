document.addEventListener("DOMContentLoaded", function () {
  const projectName = sessionStorage.getItem("currentProject");
  console.log("ProjectGot: "+ projectName);
  updateProjectDetails(projectName);
});

function updateProjectDetails(projectName) {
  const details = [
    {
      name: "Chat",
      srcCode: "https://github.com/sandarva3/chat",
      description: `A simple C program through which we can group chat live on local network. Just built this for fun.
      How it works: I'll open hotspot, other devices will connect on that. And we can group chat through this program witout 
      being connected to any wifi. You can see the codebase on Github.`
    },
    {
      name: "Boardsphere",
      srcCode: "https://github.com/sandarva3/BoardSphere",
      description: `BoardSphere is a collaborative discussion platform where users can have real-time
      conversations on a variety of topics. There are boards dedicated to broad fields(like Artificial Intelligence)
      Inside each Boards there are topics(like machine learning) where users can discuss.
      The discussion will be on real time. Only registered users can create topics and engage in chat.
      I was unable to deploy this application because
       I didn't find any platform that support Redis and Postgresql on free plan.
      You can see some screenshots on my GitHub repo.`
    },
    {
      name: "Project Pencil",
      live:"https://propen.pythonanywhere.com/",
      srcCode: "https://github.com/sandarva3/BoardSphere",
      description: `Once I had to compress an image of my citizenship card,but I can't trust other sites.
      So,I decided to create my own image compressor. Then I thought why not add
      other features to it that mightbe useful to me.I added some features.
      But after deploying I noticed the hosting service's free plan doesn't support
      the YouTube API,so two youtube features won't work,but the rest do.`,
    },
    {
      name: "Ecom",
      live:"https://ecom3.pythonanywhere.com/",
      srcCode: "https://github.com/sandarva3/Ecom",
      description: `So this is an Ecommerce site.You can freely add items to cart,adjust quantities and finalize order.
      And the main feature of this site is..you can do bunch of those things without creating an account.
      When you're ready to pay,just fill out a quick form and make payment,your account will be
      automatically created.Your order will be placed through that account.Later you can login with that account.
      You can check website.`,
    },
    {
        name: "BlogSite",
        live:"https://zero3.pythonanywhere.com/",
        srcCode: "https://github.com/sandarva3/Blog-Site",
        description: `A Blog site.You can create account,post blogs with image.
        You can edit blogs and images posted by you. Forgot password?you can
        reset it from link that'll be provided to you in your email.
        Without an account,you can read blogs posted by others.You can check website.`,
    },
    {
        name: "Cash-Flow Monitor",
        live:"https://expend.pythonanywhere.com/",
        srcCode: "https://github.com/sandarva3/CashFlow_Monitor",
        description: `I once struggled with overspending on junk food and non-essentials.To gain control,I created this
        site to track my expenses,allowing me to see where my money was going. It made me
        more aware of wasteful spendings and savings.This dual feedback improved my habits,
        so nowadays I waste very much less money.Hope this'll be helpful to people with similar problems.
        You can go to the site.You only add to Notpurchase if u resist it from
        purchasing and add Purchase if you regret from purchasing.`,
    },
    {
      name: "Epro",
      live:"https://alpha3.pythonanywhere.com/",
      srcCode: "https://github.com/sandarva3/Epro",
      description: `I got to know about the Enigma code used by German troops in WW2 and the machine
      that decrypted it.That night I thought lot about it.Wrote a program to
      encrypt and decrypt messages.Found the old program on my PC and decided to make it website,
      doing the same encryption and decryption thing.You can see the site.`,
    },
    
  ];

  const projectDetail = details.find((detail) => detail.name === projectName);
  if (projectDetail) {
    document.getElementById("projectname").textContent = projectName;
    document.getElementById("projectsrc").href = projectDetail.srcCode;
    if(projectDetail.live){
        document.getElementById("livesite").href = projectDetail.live;
    }
    else{
        document.getElementById("livesite").removeAttribute('href');
        document.getElementById("livesite").textContent = "";
    }
    document.getElementById("projectdescription").textContent =
      projectDetail.description;
  }
}
