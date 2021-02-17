'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">government-portal-web documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AccountPageModule.html" data-type="entity-link">AccountPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AccountPageModule-209d90133b1e30bf0a539f510fc750f4"' : 'data-target="#xs-components-links-module-AccountPageModule-209d90133b1e30bf0a539f510fc750f4"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AccountPageModule-209d90133b1e30bf0a539f510fc750f4"' :
                                            'id="xs-components-links-module-AccountPageModule-209d90133b1e30bf0a539f510fc750f4"' }>
                                            <li class="link">
                                                <a href="components/AccountPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AccountPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AccountPageRoutingModule.html" data-type="entity-link">AccountPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AgriculturePageModule.html" data-type="entity-link">AgriculturePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AgriculturePageModule-3babf439926047de5276ed134cd18a12"' : 'data-target="#xs-components-links-module-AgriculturePageModule-3babf439926047de5276ed134cd18a12"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AgriculturePageModule-3babf439926047de5276ed134cd18a12"' :
                                            'id="xs-components-links-module-AgriculturePageModule-3babf439926047de5276ed134cd18a12"' }>
                                            <li class="link">
                                                <a href="components/AgriculturePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AgriculturePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AgriculturePageRoutingModule.html" data-type="entity-link">AgriculturePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-AppModule-f8a32ffafd9b514ad59fa0556865ab8d"' : 'data-target="#xs-components-links-module-AppModule-f8a32ffafd9b514ad59fa0556865ab8d"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-AppModule-f8a32ffafd9b514ad59fa0556865ab8d"' :
                                            'id="xs-components-links-module-AppModule-f8a32ffafd9b514ad59fa0556865ab8d"' }>
                                            <li class="link">
                                                <a href="components/AppComponent.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppRoutingModule.html" data-type="entity-link">AppRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/BankingPageModule.html" data-type="entity-link">BankingPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-BankingPageModule-29151d39203e3ad5fdaa6184fd8a6fa5"' : 'data-target="#xs-components-links-module-BankingPageModule-29151d39203e3ad5fdaa6184fd8a6fa5"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-BankingPageModule-29151d39203e3ad5fdaa6184fd8a6fa5"' :
                                            'id="xs-components-links-module-BankingPageModule-29151d39203e3ad5fdaa6184fd8a6fa5"' }>
                                            <li class="link">
                                                <a href="components/BankingPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">BankingPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/BankingPageRoutingModule.html" data-type="entity-link">BankingPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/CreateAccountPageModule.html" data-type="entity-link">CreateAccountPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-CreateAccountPageModule-085953235a56022c8fd3abb7fc59da4e"' : 'data-target="#xs-components-links-module-CreateAccountPageModule-085953235a56022c8fd3abb7fc59da4e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-CreateAccountPageModule-085953235a56022c8fd3abb7fc59da4e"' :
                                            'id="xs-components-links-module-CreateAccountPageModule-085953235a56022c8fd3abb7fc59da4e"' }>
                                            <li class="link">
                                                <a href="components/CreateAccountPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CreateAccountPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/CreateAccountPageRoutingModule.html" data-type="entity-link">CreateAccountPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EducationPageModule.html" data-type="entity-link">EducationPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EducationPageModule-be35904e6118699843556add767c47d8"' : 'data-target="#xs-components-links-module-EducationPageModule-be35904e6118699843556add767c47d8"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EducationPageModule-be35904e6118699843556add767c47d8"' :
                                            'id="xs-components-links-module-EducationPageModule-be35904e6118699843556add767c47d8"' }>
                                            <li class="link">
                                                <a href="components/EducationPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EducationPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EducationPageRoutingModule.html" data-type="entity-link">EducationPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EmploymentPageModule.html" data-type="entity-link">EmploymentPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EmploymentPageModule-c534e445a95bd75afc6062166623668c"' : 'data-target="#xs-components-links-module-EmploymentPageModule-c534e445a95bd75afc6062166623668c"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EmploymentPageModule-c534e445a95bd75afc6062166623668c"' :
                                            'id="xs-components-links-module-EmploymentPageModule-c534e445a95bd75afc6062166623668c"' }>
                                            <li class="link">
                                                <a href="components/EmploymentPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EmploymentPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EmploymentPageRoutingModule.html" data-type="entity-link">EmploymentPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EnvironmentPageModule.html" data-type="entity-link">EnvironmentPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-EnvironmentPageModule-dd26c0edcfa1185c2a36402720c2d191"' : 'data-target="#xs-components-links-module-EnvironmentPageModule-dd26c0edcfa1185c2a36402720c2d191"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-EnvironmentPageModule-dd26c0edcfa1185c2a36402720c2d191"' :
                                            'id="xs-components-links-module-EnvironmentPageModule-dd26c0edcfa1185c2a36402720c2d191"' }>
                                            <li class="link">
                                                <a href="components/EnvironmentPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">EnvironmentPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/EnvironmentPageRoutingModule.html" data-type="entity-link">EnvironmentPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HealthcarePageModule.html" data-type="entity-link">HealthcarePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HealthcarePageModule-a816187eaaf85c57aa5562d0af610f12"' : 'data-target="#xs-components-links-module-HealthcarePageModule-a816187eaaf85c57aa5562d0af610f12"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HealthcarePageModule-a816187eaaf85c57aa5562d0af610f12"' :
                                            'id="xs-components-links-module-HealthcarePageModule-a816187eaaf85c57aa5562d0af610f12"' }>
                                            <li class="link">
                                                <a href="components/HealthcarePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HealthcarePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HealthcarePageRoutingModule.html" data-type="entity-link">HealthcarePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageModule.html" data-type="entity-link">HomePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HomePageModule-57656e3d3b4aa3fc3bc89b4895aa203a"' : 'data-target="#xs-components-links-module-HomePageModule-57656e3d3b4aa3fc3bc89b4895aa203a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HomePageModule-57656e3d3b4aa3fc3bc89b4895aa203a"' :
                                            'id="xs-components-links-module-HomePageModule-57656e3d3b4aa3fc3bc89b4895aa203a"' }>
                                            <li class="link">
                                                <a href="components/HomePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HomePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageRoutingModule.html" data-type="entity-link">HomePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/HousingPageModule.html" data-type="entity-link">HousingPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-HousingPageModule-539a91d6dab023f9559ac80112b8cba3"' : 'data-target="#xs-components-links-module-HousingPageModule-539a91d6dab023f9559ac80112b8cba3"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-HousingPageModule-539a91d6dab023f9559ac80112b8cba3"' :
                                            'id="xs-components-links-module-HousingPageModule-539a91d6dab023f9559ac80112b8cba3"' }>
                                            <li class="link">
                                                <a href="components/HousingPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">HousingPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/HousingPageRoutingModule.html" data-type="entity-link">HousingPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/JusticePageModule.html" data-type="entity-link">JusticePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-JusticePageModule-12ea8257208a6fa7b85f79775cf030ac"' : 'data-target="#xs-components-links-module-JusticePageModule-12ea8257208a6fa7b85f79775cf030ac"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-JusticePageModule-12ea8257208a6fa7b85f79775cf030ac"' :
                                            'id="xs-components-links-module-JusticePageModule-12ea8257208a6fa7b85f79775cf030ac"' }>
                                            <li class="link">
                                                <a href="components/JusticePage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">JusticePage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/JusticePageRoutingModule.html" data-type="entity-link">JusticePageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MediaPageModule.html" data-type="entity-link">MediaPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-MediaPageModule-80b2372a0cfe790cd696a6ac096838bc"' : 'data-target="#xs-components-links-module-MediaPageModule-80b2372a0cfe790cd696a6ac096838bc"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-MediaPageModule-80b2372a0cfe790cd696a6ac096838bc"' :
                                            'id="xs-components-links-module-MediaPageModule-80b2372a0cfe790cd696a6ac096838bc"' }>
                                            <li class="link">
                                                <a href="components/MediaPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">MediaPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/MediaPageRoutingModule.html" data-type="entity-link">MediaPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PageNotFoundPageModule.html" data-type="entity-link">PageNotFoundPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PageNotFoundPageModule-c5ff993b00edc3a49ff0444265dca012"' : 'data-target="#xs-components-links-module-PageNotFoundPageModule-c5ff993b00edc3a49ff0444265dca012"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PageNotFoundPageModule-c5ff993b00edc3a49ff0444265dca012"' :
                                            'id="xs-components-links-module-PageNotFoundPageModule-c5ff993b00edc3a49ff0444265dca012"' }>
                                            <li class="link">
                                                <a href="components/PageNotFoundPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PageNotFoundPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PageNotFoundPageRoutingModule.html" data-type="entity-link">PageNotFoundPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/PageUnderConstructionPageModule.html" data-type="entity-link">PageUnderConstructionPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-PageUnderConstructionPageModule-45ae7bfef1e5e39ccc38cd536d460488"' : 'data-target="#xs-components-links-module-PageUnderConstructionPageModule-45ae7bfef1e5e39ccc38cd536d460488"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-PageUnderConstructionPageModule-45ae7bfef1e5e39ccc38cd536d460488"' :
                                            'id="xs-components-links-module-PageUnderConstructionPageModule-45ae7bfef1e5e39ccc38cd536d460488"' }>
                                            <li class="link">
                                                <a href="components/PageUnderConstructionPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">PageUnderConstructionPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/PageUnderConstructionPageRoutingModule.html" data-type="entity-link">PageUnderConstructionPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/RegistrationsPageModule.html" data-type="entity-link">RegistrationsPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-RegistrationsPageModule-8af47d50bfb0b02913af0a82b639e207"' : 'data-target="#xs-components-links-module-RegistrationsPageModule-8af47d50bfb0b02913af0a82b639e207"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-RegistrationsPageModule-8af47d50bfb0b02913af0a82b639e207"' :
                                            'id="xs-components-links-module-RegistrationsPageModule-8af47d50bfb0b02913af0a82b639e207"' }>
                                            <li class="link">
                                                <a href="components/RegistrationsPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">RegistrationsPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/RegistrationsPageRoutingModule.html" data-type="entity-link">RegistrationsPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/SignInPageModule.html" data-type="entity-link">SignInPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-SignInPageModule-de1e5bb9b4541beb4d8ccb879f75d4a2"' : 'data-target="#xs-components-links-module-SignInPageModule-de1e5bb9b4541beb4d8ccb879f75d4a2"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-SignInPageModule-de1e5bb9b4541beb4d8ccb879f75d4a2"' :
                                            'id="xs-components-links-module-SignInPageModule-de1e5bb9b4541beb4d8ccb879f75d4a2"' }>
                                            <li class="link">
                                                <a href="components/SignInPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">SignInPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/SignInPageRoutingModule.html" data-type="entity-link">SignInPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TradingPageModule.html" data-type="entity-link">TradingPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TradingPageModule-d50290dce6eda8a2cff7c7127df7275e"' : 'data-target="#xs-components-links-module-TradingPageModule-d50290dce6eda8a2cff7c7127df7275e"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TradingPageModule-d50290dce6eda8a2cff7c7127df7275e"' :
                                            'id="xs-components-links-module-TradingPageModule-d50290dce6eda8a2cff7c7127df7275e"' }>
                                            <li class="link">
                                                <a href="components/TradingPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TradingPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TradingPageRoutingModule.html" data-type="entity-link">TradingPageRoutingModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/TravelPageModule.html" data-type="entity-link">TravelPageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#components-links-module-TravelPageModule-8f49e6636e5eabef60760302925be35a"' : 'data-target="#xs-components-links-module-TravelPageModule-8f49e6636e5eabef60760302925be35a"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TravelPageModule-8f49e6636e5eabef60760302925be35a"' :
                                            'id="xs-components-links-module-TravelPageModule-8f49e6636e5eabef60760302925be35a"' }>
                                            <li class="link">
                                                <a href="components/TravelPage.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TravelPage</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/TravelPageRoutingModule.html" data-type="entity-link">TravelPageRoutingModule</a>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppPage.html" data-type="entity-link">AppPage</a>
                            </li>
                            <li class="link">
                                <a href="classes/LottieSplashScreen.html" data-type="entity-link">LottieSplashScreen</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/FirebaseRealtimeService.html" data-type="entity-link">FirebaseRealtimeService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GoogleAuthService.html" data-type="entity-link">GoogleAuthService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});