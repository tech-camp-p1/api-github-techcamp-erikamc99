const APIURL = 'https://api.github.com/users/'

const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');

const getUser = async (username) => {
    try {
        const response = await axios.get(`${APIURL}${username}`);
        userCard(response.data);
        await getRepos(username);
    } catch (error) {
        cardError(error, 'No profile with this username');
    }
};

const getRepos = async (username) => {
    try {
        const response = await axios.get(`${APIURL}${username}/repos`);
        addRepos(response.data);
    } catch (error) {
        cardError(error, 'No repos found');
    }
};

const userCard = (user) => {
    const createCard = `
    <div class= "card">
        <img src="${user.avatar_url}" alt="user-avatar" class="avatar"/>
        <div class="user-info">
            <h2>${user.name || user.name}</h2>
            <p>${user.bio || 'Biography not available'}</p>
            <ul>
                <li><strong>${user.followers}</strong>&nbspFollowers</li>
                <li><strong>${user.following}</strong>&nbspFollowing</li>
                <li><strong>${user.public_repos}</strong>&nbspRepos</li>
            </ul>    
            <div id="repo"></div>
        </div>
    </div>  
    `;
    main.innerHTML = createCard;
};

const addRepos = (repos) => {
    const cardRepos = document.getElementById('repo');
    cardRepos.innerHTML = ''; // Clear previous repos
    repos.slice(0, 5).forEach((repo) => {
        const repoElement = document.createElement('a');
        repoElement.href = repo.html_url;
        repoElement.target = '_blank';
        repoElement.innerText = repo.name;
        cardRepos.appendChild(repoElement);
    });
};

const cardError = (error, defaultMessage) => {
    const message = (error.response && error.response.status === 404)
    ? defaultMessage
    : 'An error occurred';
    const createCardError = `
        <div class="card">
      <h1>${message}</h1>
        </div>
    `;
    main.innerHTML = createCardError;
};

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = search.value.trim();
  if (user) {
    getUser(user);
    search.value = '';
  }
});