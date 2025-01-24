// Step 1: Get references to DOM elements
const monthlyPlanBtn = document.getElementById("monthlyPlanBtn")
const annualPlanBtn = document.getElementById("annualPlanBtn")
const plansContainer = document.getElementById("plansContainer")

// Step 2: Function to render the cards
function renderPricingCards(plans) {
    plansContainer.innerHTML = "" // Initial message before the plans load

    plans.forEach(plan => {
        // Create card element
        const planElement = document.createElement("article");
        planElement.classList.add("pricing-tiers__content__plan");

        if (plan.isPopular) {
            planElement.classList.add("active-plan");
        }

        // Price 
        const [price, duration] = plan.price.split(" / ");

        // Create the card details
        planElement.innerHTML = `
            ${plan.isPopular ? '<p class="pricing-tiers__content__plan__highlight">Most Popular</p>' : ""}
            <div class="pricing-tiers__content__plan__header">
              <h6>${plan.plan} Plan</h6>
              <p>${plan.description}</p>
            </div>
            <div class="pricing-tiers__content__plan__price">
              <p class="pricing-tiers__content__plan__price__amount" id="basicPlanPrice">
                <span>
                ${price}
                </span>
                <small>
                / ${duration}
                </small>
              </p>
              <p class="pricing-tiers__plan__price__label" id="basicPlanLabel">${plan.billingPeriod}</p>
            </div>
            <ul class="pricing-tiers__content__plan__features">
                ${plan.features.map((feature) => `
                    <li>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                            d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
                            fill="#EEF2FF" />
                            <path
                            d="M9.64715 15.5245L10.0007 15.878L10.3543 15.5245L19.1931 6.68562L19.9002 7.39272L10.0007 17.2922L4.34383 11.6354L5.05093 10.9283L9.64715 15.5245Z"
                            fill="#6366F1" stroke="#6366F1" />
                        </svg>
                        <span>${feature}</span>
                    </li>`
                ).join("")}
            </ul>
            ${plan.isPopular ?
                `<button type="button" class="button button--primary button--size-xl">
                    ${plan.buttonLabel}
                </button>`
                :
                `<button type="button" class="button button--secondary button--size-xl">
                    ${plan.buttonLabel}
                </button>`
            }
        `;

        // Apend the card to the container
        plansContainer.append(planElement)
    });
}

// Step 3: Function to fetch and handle JSON data
async function fetchPlanData() {
    // Initial message before the plans load
    plansContainer.innerHTML = "<p>Loading plans for You...</p>"

    try {
        const response = await fetch("./data/pricing-plan.json") // Fetch plan data

        if (!response.ok) {
            throw new Error("Failed to load plan data")
        }
        const planData = await response.json()

        // Render monthly plans by default
        renderPricingCards(planData.monthly)

        // Add event listeners for tab switching
        monthlyPlanBtn.addEventListener("click", () => {
            // Update active tab
            monthlyPlanBtn.classList.remove("button--toggle-inactive")
            annualPlanBtn.classList.add("button--toggle-inactive")

            // Render monthly plans
            renderPricingCards(planData.monthly)
        })

        annualPlanBtn.addEventListener("click", () => {
            // Update active tab
            annualPlanBtn.classList.remove("button--toggle-inactive")
            monthlyPlanBtn.classList.add("button--toggle-inactive")

            // Render annual plans
            renderPricingCards(planData.annually)
        })
    } catch (error) {
        console.log("Error fetching data plans: ", error)
        plansContainer.innerHTML = "<p>Failed to load plans. Please try again later.</p>";
    }
}

// Step 4: Call the fetch function on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchPlanData(); // Load and display the monthly data on page load
});
