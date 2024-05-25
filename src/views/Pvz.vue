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
                plantList: [], // Tanaman yang sedang ditampilkan
                plantListCache: [], // Cache data tanaman
                plantsLoaded: false,
                loading: false
            };
        },
        computed: {
            totalItems() {
                return this.plantList.length;
            },
            totalPages() {
                return Math.ceil(this.totalItems / this.itemsPerPage);
            },
            paginatedList() {
                const startIndex = (this.currentPage - 1) * this.itemsPerPage;
                const endIndex = startIndex + this.itemsPerPage;
                return this.plantList.slice(startIndex, endIndex);
            },
        },
        methods: {
            async pageChanged(page) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
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
            plantsDetail() {
                const audio = this.$refs.clickAudio;
                audio.play();
                audio.playbackRate = 1.5;
                this.mainMenu = false;
                this.plantsMenu = true;
                this.loading = true;

                if (!this.plantsLoaded) {
                    this.getlistPlants();
                    this.plantsLoaded = true;
                } else {
                    this.plantList = this.plantListCache;
                }

                setTimeout(() => {
                    this.loading = false;
                }, 6000);
            },
            zombiesDetail() {
                const audio = this.$refs.clickAudio;
                audio.play();
                audio.playbackRate = 1.5;
                this.mainMenu = false;
                this.zombiesMenu = true;
            },
            areasDetail() {
                const audio = this.$refs.clickAudio;
                audio.play();
                audio.playbackRate = 1.5;
                this.mainMenu = false;
                this.areasMenu = true;
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
                    let response = await fetch(
                        "https://cors-anywhere.herokuapp.com/https://pvz-2-api.vercel.app/api/plants"
                    );

                    if (!response.ok) {
                        throw new Error("Failed to fetch plant names");
                    }

                    let plantNames = await response.json();

                    // Menyimpan data tanaman dalam cache
                    for (const plantName of plantNames) {
                        let plantResponse = await fetch(
                            `https://cors-anywhere.herokuapp.com/https://pvz-2-api.vercel.app/api/plants/${plantName}`
                        );
                        if (!plantResponse.ok) {
                            throw new Error(`Failed to fetch plant details for ${plantName}`);
                        }
                        let plantData = await plantResponse.json();

                        let sunCost = plantData["Sun cost"] !== undefined ? plantData["Sun cost"] : plantData.cost;
                        this.plantListCache.push({
                            name: plantName,
                            image: plantData.image,
                            sunCost: sunCost
                        });
                    }

                    // Gunakan data tanaman yang baru diambil dari API
                    this.plantList = [...this
                        .plantListCache
                    ]; // Gunakan spread operator untuk menghindari referensi langsung ke cache
                } catch (error) {
                    console.error('Error fetching plants:', error);
                }
            }

        },
        mounted() {
            // Data tanaman dimuat pada saat aplikasi dimulai
            // this.getlistPlants()
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
                    <img class="card-img-top d-block mx-auto mt-2" src="../assets/images/area.png" alt="Title"
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
                <h4 class="mt-4 mb-3 text-center" v-if="loading">Wait...</h4>
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
