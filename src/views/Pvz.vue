<script>
    export default {
        data() {
            return {
                currentPage: 1,
                itemsPerPage: 12,
                pvz: false,
                mainMenu: true,
                plantsMenu: false,
                zombiesMenu: false,
                areasMenu: false,
                plantList: [],
                plantListCache: [],
                plantsLoaded: false,
                zombieList: [],
                zombieListCache: [],
                zombiesLoaded: false,
                areaList: [],
                areaListCache: [],
                areasLoaded: false,
                loading: false
            };
        },
        computed: {
            totalItems() {
                if (this.plantsMenu) return this.plantList.length;
                if (this.zombiesMenu) return this.zombieList.length;
                if (this.areasMenu) return this.areaList.length;
                return 0;
            },
            totalPages() {
                return Math.ceil(this.totalItems / this.itemsPerPage);
            },
            paginatedList() {
                const start = (this.currentPage - 1) * this.itemsPerPage;
                const end = start + this.itemsPerPage;
                if (this.plantsMenu) return this.plantList.slice(start, end);
                if (this.zombiesMenu) return this.zombieList.slice(start, end);
                if (this.areasMenu) return this.areaList.slice(start, end);
                return [];
            },
        },
        methods: {
            async pageChanged(page) {
                this.currentPage = page;
            },
            async Sound() {
                const audio = this.$refs.themeAudio;
                if (audio.paused) {
                    audio.play();
                    this.pvz = true;
                } else {
                    audio.pause();
                    this.pvz = false;
                }
                audio.volume = 0.5;
            },
            async plantsDetail() {
                const audio = this.$refs.clickAudio;
                audio.play();
                audio.playbackRate = 1.5;
                this.mainMenu = false;
                this.plantsMenu = true;
                this.currentPage = 1;
                if (!this.plantsLoaded) {
                    await this.getlistPlants();
                    this.plantsLoaded = true;
                } else {
                    this.plantList = this.plantListCache;
                }
            },
            async zombiesDetail() {
                const audio = this.$refs.clickAudio;
                audio.play();
                audio.playbackRate = 1.5;
                this.mainMenu = false;
                this.zombiesMenu = true;
                this.currentPage = 1;
                if (!this.zombiesLoaded) {
                    await this.getlistZombies();
                    this.zombiesLoaded = true;
                } else {
                    this.zombieList = this.zombieListCache;
                }
            },
            async areasDetail() {
                const audio = this.$refs.clickAudio;
                audio.play();
                audio.playbackRate = 1.5;
                this.mainMenu = false;
                this.areasMenu = true;
                this.currentPage = 1;
                if (!this.areasLoaded) {
                    await this.getlistAreas();
                    this.areasLoaded = true;
                } else {
                    this.areaList = this.areaListCache;
                }
            },
            back() {
                const audio = this.$refs.clickAudio;
                audio.play();
                audio.playbackRate = 1.5;
                this.mainMenu = true;
                this.plantsMenu = false;
                this.zombiesMenu = false;
                this.areasMenu = false;
            },
            async getlistPlants() {
                try {
                    this.loading = true;
                    let response = await fetch("https://pvz-2-api.vercel.app/api/plants");
                    if (!response.ok) throw new Error("Failed to fetch plant names");
                    let plantNames = await response.json();

                    let details = await Promise.all(
                        plantNames.map(name => fetch(`https://pvz-2-api.vercel.app/api/plants/${name}`).then(r => r.json()))
                    );

                    this.plantListCache = details.map((data, i) => ({
                        name: plantNames[i],
                        image: data.image,
                        sunCost: data["Sun cost"] !== undefined ? data["Sun cost"] : data.cost
                    }));
                    this.plantList = [...this.plantListCache];
                } catch (error) {
                    console.error('Error fetching plants:', error);
                } finally {
                    this.loading = false;
                }
            },
            async getlistZombies() {
                try {
                    this.loading = true;
                    let response = await fetch("https://pvz-2-api.vercel.app/api/zombies");
                    if (!response.ok) throw new Error("Failed to fetch zombie names");
                    let zombieNames = await response.json();

                    let details = await Promise.all(
                        zombieNames.map(name => fetch(`https://pvz-2-api.vercel.app/api/zombies/${name}`).then(r => r.json()))
                    );

                    this.zombieListCache = details.map((data, i) => ({
                        name: zombieNames[i],
                        image: data.image,
                        toughness: data.toughness || '',
                        speed: data.speed || ''
                    }));
                    this.zombieList = [...this.zombieListCache];
                } catch (error) {
                    console.error('Error fetching zombies:', error);
                } finally {
                    this.loading = false;
                }
            },
            async getlistAreas() {
                try {
                    this.loading = true;
                    let response = await fetch("https://pvz-2-api.vercel.app/api/areas");
                    if (!response.ok) throw new Error("Failed to fetch area names");
                    let areaNames = await response.json();

                    let details = await Promise.all(
                        areaNames.map(name =>
                            fetch(`https://pvz-2-api.vercel.app/api/areas/${name}`).then(r => r.ok ? r.json() : null).catch(() => null)
                        )
                    );

                    this.areaListCache = details.map((data, i) => ({
                        name: areaNames[i],
                        image: data ? data.image : null
                    }));
                    this.areaList = [...this.areaListCache];
                } catch (error) {
                    console.error('Error fetching areas:', error);
                } finally {
                    this.loading = false;
                }
            }
        },
    };
</script>



<template>
    <div class="container">
        <button class="btn d-block ms-auto mt-3" style="background-color: #6c3c0c;" @click="Sound()">
            <i class="bi bi-volume-up-fill text-white" v-if="pvz"></i>
            <i class="bi bi-volume-mute-fill text-white" v-else></i>
        </button>
        <!-- MAIN MENU  -->
        <div class="row mt-3" v-if="mainMenu">
            <div class="title mb-5">
                <h1 class="text-center fst-italic text-light fw-bold">Suburban Almanac</h1>
                <img src="../assets/images/logo.png" alt="" srcset="" class="img-fluid">
                <h2 class="text-center fst-italic fw-bold">By Zan</h2>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card" style="background-color: #6c3c0c;">
                    <img class="card-img-top d-block mx-auto mt-2" src="../assets/images/sunflower.png" alt="Title"
                        style="width: 100px;" />
                    <div class="card-body">
                        <h4 class="card-title text-white mb-3 text-center">Plants</h4>
                        <button class="btn btn-secondary w-100" @click="plantsDetail()">View Details</button>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card" style="background-color: darkslategray;">
                    <img class="card-img-top d-block mx-auto mt-2" src="../assets/images/zombie.png" alt="Title"
                        style="width: 100px;" />
                    <div class="card-body">
                        <h4 class="card-title text-white mb-3 text-center">Zombies</h4>
                        <button class="btn btn-secondary w-100" @click="zombiesDetail()">View Details</button>
                    </div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="card" style="background-color: greenyellow">
                    <img class="card-img-top d-block mx-auto mt-2" src="../assets/images/image.png" alt="Title"
                        style="width: 100px;" />
                    <div class="card-body">
                        <h4 class="card-title text-white mb-3 text-center">Areas</h4>
                        <button class="btn btn-secondary w-100" @click="areasDetail()">View Details</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- End Main Menu -->

        <!-- PLANTS -->
        <div class="row mt-3" v-if="plantsMenu">
            <div class="col-md-12">
                <button @click="back()" class="btn btn-secondary"><i class="bi bi-backspace-fill text-light"></i>
                    Back</button>
            </div>
            <div class="title mt-3 mb-5">
                <h2 class="text-center">Plants</h2>
                <h4 class="mt-4 mb-3 text-center" v-if="loading">Loading...</h4>
            </div>

            <div class="col-md-3 mb-3" v-for="plant in paginatedList" :key="plant.name">
                <div class="card text-white" style="background-color: #6c3c0c;">
                    <img style="width: 70px;" class="card-img-top d-block mx-auto mt-2"
                        :src="'https://pvz-2-api.vercel.app/' + plant.image" :alt="plant.name" />
                    <div class="card-body">
                        <h4 class="card-title text-center">{{ plant . name }}</h4>
                        <p class="text-warning fw-bold text-center"><i class="bi bi-sun-fill"></i> {{ plant . sunCost }}
                        </p>
                    </div>
                </div>
            </div>


            <!-- Pagination -->
            <div class="col-md-12 mt-3">
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                            <button class="page-link" @click="pageChanged(currentPage - 1)"
                                :disabled="currentPage === 1">
                                Previous
                            </button>
                        </li>
                        <li class="page-item" v-for="page in totalPages" :key="page"
                            :class="{ 'active': page === currentPage }">
                            <button class="page-link" @click="pageChanged(page)">
                                {{ page }}
                            </button>
                        </li>
                        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                            <button class="page-link" @click="pageChanged(currentPage + 1)"
                                :disabled="currentPage === totalPages">
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>



        <!-- ZOMBIES -->
        <div class="row mt-3" v-if="zombiesMenu">
            <div class="col-md-12">
                <button @click="back()" class="btn btn-secondary"><i class="bi bi-backspace-fill text-light"></i>
                    Back</button>
            </div>
            <div class="title mt-3 mb-5">
                <h2 class="text-center">Zombies</h2>
                <h4 class="mt-4 mb-3 text-center" v-if="loading">Loading...</h4>
            </div>

            <div class="col-md-3 mb-3" v-for="zombie in paginatedList" :key="zombie.name">
                <div class="card text-white" style="background-color: darkslategray;">
                    <img style="width: 70px;" class="card-img-top d-block mx-auto mt-2"
                        :src="'https://pvz-2-api.vercel.app' + zombie.image" :alt="zombie.name" />
                    <div class="card-body">
                        <h5 class="card-title text-center">{{ zombie.name }}</h5>
                        <p class="text-info text-center mb-1">{{ zombie.toughness }}</p>
                        <p class="text-secondary text-center mb-0">{{ zombie.speed }}</p>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="col-md-12 mt-3">
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                            <button class="page-link" @click="pageChanged(currentPage - 1)"
                                :disabled="currentPage === 1">
                                Previous
                            </button>
                        </li>
                        <li class="page-item" v-for="page in totalPages" :key="page"
                            :class="{ 'active': page === currentPage }">
                            <button class="page-link" @click="pageChanged(page)">
                                {{ page }}
                            </button>
                        </li>
                        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                            <button class="page-link" @click="pageChanged(currentPage + 1)"
                                :disabled="currentPage === totalPages">
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>

        <!-- AREAS -->
        <div class="row mt-3" v-if="areasMenu">
            <div class="col-md-12">
                <button @click="back()" class="btn btn-secondary"><i class="bi bi-backspace-fill text-light"></i>
                    Back</button>
            </div>
            <div class="title mt-3 mb-5">
                <h2 class="text-center">Areas</h2>
                <h4 class="mt-4 mb-3 text-center" v-if="loading">Loading...</h4>
            </div>

            <div class="col-md-3 mb-3" v-for="area in paginatedList" :key="area.name">
                <div class="card text-white" style="background-color: greenyellow;">
                    <div class="card-body">
                        <h5 class="card-title text-center text-dark">{{ area.name }}</h5>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div class="col-md-12 mt-3">
                <nav aria-label="Page navigation">
                    <ul class="pagination justify-content-center">
                        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                            <button class="page-link" @click="pageChanged(currentPage - 1)"
                                :disabled="currentPage === 1">
                                Previous
                            </button>
                        </li>
                        <li class="page-item" v-for="page in totalPages" :key="page"
                            :class="{ 'active': page === currentPage }">
                            <button class="page-link" @click="pageChanged(page)">
                                {{ page }}
                            </button>
                        </li>
                        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                            <button class="page-link" @click="pageChanged(currentPage + 1)"
                                :disabled="currentPage === totalPages">
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>


    <!-- AUDIO -->

    <audio ref="themeAudio" controls loop class="d-none">
        <source src="../assets/audio/theme.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>

    <audio ref="clickAudio" controls class="d-none">
        <source src="../assets/audio/mouse-click-117076.mp3" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
</template>
