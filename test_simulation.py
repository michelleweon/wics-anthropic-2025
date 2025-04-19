import os
import json
import time
import csv
import requests
from itertools import product
import matplotlib.pyplot as plt

class PolicySimulator:
    def __init__(self, policy_area):
        self.policy_area = policy_area
        self.results = []
        self.parameters = {}
        self.api_key = os.getenv("ANTHROPIC_API_KEY")  # Set this in your environment
        
    def set_parameters(self, parameters):
        """Define the parameters and their possible values for simulation"""
        self.parameters = parameters
        
    def generate_prompt(self, params):
        """Create a structured prompt for Claude based on the policy area and specific parameters"""
        if self.policy_area == "carbon_pricing":
            prompt = f"""
            You are a policy analysis expert. Analyze the following carbon pricing policy scenario:
            
            POLICY PARAMETERS:
            - Carbon price: ${params['carbon_price']} per ton of CO2
            - Implementation timeline: {params['timeline']} years
            - Revenue allocation: {params['revenue_allocation']}
            - Sectors covered: {params['sectors_covered']}
            
            For this specific policy configuration, provide the following analysis:
            
            1. MOST LIKELY SCENARIO:
            Provide a realistic assessment of what would happen if this policy were implemented as specified. Include economic impacts, emission reductions, and public response.
            
            2. BEST-CASE SCENARIO:
            Describe the most positive possible outcome with this policy configuration. What conditions would need to be true for this to happen?
            
            3. WORST-CASE SCENARIO:
            Describe the most negative possible outcome with this policy configuration. What risk factors would lead to this result?
            
            4. KEY FACTORS:
            List the 5 most important factors that would influence which scenario actually occurs.
            
            Format your response as JSON with the following structure:
            ```json
            {{
                "most_likely_scenario": "description",
                "best_case_scenario": "description",
                "worst_case_scenario": "description",
                "key_factors": ["factor1", "factor2", "factor3", "factor4", "factor5"]
            }}
            ```
            Only provide the JSON with no additional text.
            """
        elif self.policy_area == "education_funding":
            prompt = f"""
            You are a policy analysis expert. Analyze the following education funding policy scenario:
            
            POLICY PARAMETERS:
            - Funding increase: {params['funding_increase']}% over baseline
            - Allocation method: {params['allocation_method']}
            - Target areas: {params['target_areas']}
            - Implementation period: {params['implementation_period']} years
            
            For this specific policy configuration, provide the following analysis:
            
            1. MOST LIKELY SCENARIO:
            Provide a realistic assessment of what would happen if this policy were implemented as specified. Include impacts on educational outcomes, district disparities, and public response.
            
            2. BEST-CASE SCENARIO:
            Describe the most positive possible outcome with this policy configuration. What conditions would need to be true for this to happen?
            
            3. WORST-CASE SCENARIO:
            Describe the most negative possible outcome with this policy configuration. What risk factors would lead to this result?
            
            4. KEY FACTORS:
            List the 5 most important factors that would influence which scenario actually occurs.
            
            Format your response as JSON with the following structure:
            ```json
            {{
                "most_likely_scenario": "description",
                "best_case_scenario": "description",
                "worst_case_scenario": "description",
                "key_factors": ["factor1", "factor2", "factor3", "factor4", "factor5"]
            }}
            ```
            Only provide the JSON with no additional text.
            """
        elif self.policy_area == "healthcare_policy":
            prompt = f"""
            You are a policy analysis expert. Analyze the following healthcare policy scenario:
            
            POLICY PARAMETERS:
            - Coverage expansion: {params['coverage_expansion']}
            - Cost control mechanism: {params['cost_control']}
            - Provider reimbursement: {params['provider_reimbursement']}
            - Implementation timeline: {params['implementation_timeline']} years
            
            For this specific policy configuration, provide the following analysis:
            
            1. MOST LIKELY SCENARIO:
            Provide a realistic assessment of what would happen if this policy were implemented as specified. Include impacts on access to care, healthcare costs, and public health outcomes.
            
            2. BEST-CASE SCENARIO:
            Describe the most positive possible outcome with this policy configuration. What conditions would need to be true for this to happen?
            
            3. WORST-CASE SCENARIO:
            Describe the most negative possible outcome with this policy configuration. What risk factors would lead to this result?
            
            4. KEY FACTORS:
            List the 5 most important factors that would influence which scenario actually occurs.
            
            Format your response as JSON with the following structure:
            ```json
            {{
                "most_likely_scenario": "description",
                "best_case_scenario": "description",
                "worst_case_scenario": "description",
                "key_factors": ["factor1", "factor2", "factor3", "factor4", "factor5"]
            }}
            ```
            Only provide the JSON with no additional text.
            """
        else:
            prompt = "Policy area not defined"
        
        return prompt
    
    def call_claude_api(self, prompt):
        """Call Claude API using requests library"""
        headers = {
            "x-api-key": self.api_key,
            "content-type": "application/json",
            "anthropic-version": "2023-06-01"
        }
        
        data = {
            "model": "claude-3-opus-20240229",
            "max_tokens": 2000,
            "temperature": 0.2,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
        
        response = requests.post(
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            json=data
        )
        
        if response.status_code != 200:
            raise Exception(f"API call failed with status {response.status_code}: {response.text}")
            
        return response.json()
    
    def run_simulation(self, max_iterations=10):
        """Run simulations for all combinations of parameters up to max_iterations"""
        # Generate all combinations of parameters
        param_names = list(self.parameters.keys())
        param_values = list(self.parameters.values())
        combinations = list(product(*param_values))
        
        # Limit to max_iterations if needed
        combinations = combinations[:max_iterations]
        
        print(f"Running {len(combinations)} simulations...")
        
        for i, combo in enumerate(combinations):
            # Create a parameter dictionary for this iteration
            params = {param_names[i]: combo[i] for i in range(len(param_names))}
            
            # Get prompt for these parameters
            prompt = self.generate_prompt(params)
            
            # Call Claude API
            try:
                print(f"Running simulation {i+1}/{len(combinations)}: {params}")
                response = self.call_claude_api(prompt)
                
                # Extract and parse the JSON response
                try:
                    result_text = response["content"][0]["text"]
                    # Sometimes Claude might include the json code block syntax
                    if "```json" in result_text:
                        result_text = result_text.split("```json")[1].split("```")[0].strip()
                    elif "```" in result_text:
                        result_text = result_text.split("```")[1].strip()
                        
                    result_json = json.loads(result_text)
                    
                    # Add parameters to the result
                    result_json.update(params)
                    self.results.append(result_json)
                    print(f"Completed simulation {len(self.results)}/{len(combinations)}")
                    
                except json.JSONDecodeError:
                    print(f"Failed to parse JSON response for parameters: {params}")
                    print(f"Response: {result_text[:100]}...")
                
                # Respect API rate limits
                time.sleep(1)
                
            except Exception as e:
                print(f"Error with API call: {e}")
                
        return self.results
    
    def save_results(self, filename="simulation_results.json"):
        """Save simulation results to file"""
        with open(filename, 'w') as f:
            json.dump(self.results, f, indent=2)
            
    def save_results_csv(self, filename="simulation_results.csv"):
        """Save key results to CSV for easy analysis"""
        if not self.results:
            print("No results to save")
            return
            
        # Get all parameter keys from the first result
        param_keys = [k for k in self.results[0].keys() if k not in ["most_likely_scenario", "best_case_scenario", "worst_case_scenario", "key_factors"]]
        
        with open(filename, 'w', newline='') as f:
            writer = csv.writer(f)
            # Write header
            writer.writerow(param_keys + ["scenario_type", "scenario_text", "key_factor"])
            
            # Write data
            for result in self.results:
                params = [result.get(k, "") for k in param_keys]
                
                # Write most likely scenario
                writer.writerow(params + ["most_likely", result.get("most_likely_scenario", "")[:500], ""])
                
                # Write best case scenario
                writer.writerow(params + ["best_case", result.get("best_case_scenario", "")[:500], ""])
                
                # Write worst case scenario
                writer.writerow(params + ["worst_case", result.get("worst_case_scenario", "")[:500], ""])
                
                # Write key factors
                for factor in result.get("key_factors", []):
                    writer.writerow(params + ["key_factor", "", factor])
            
    def load_results(self, filename="simulation_results.json"):
        """Load simulation results from file"""
        with open(filename, 'r') as f:
            self.results = json.load(f)
            
    def analyze_results(self):
        """Basic analysis of simulation results"""
        if not self.results:
            return "No results to analyze"
            
        # Count key factors
        all_factors = []
        for result in self.results:
            all_factors.extend(result.get('key_factors', []))
            
        factor_counts = {}
        for factor in all_factors:
            factor_counts[factor] = factor_counts.get(factor, 0) + 1
            
        # Sort factors by frequency
        sorted_factors = sorted(factor_counts.items(), key=lambda x: x[1], reverse=True)
        
        return {
            "total_simulations": len(self.results),
            "top_factors": dict(sorted_factors[:10])
        }
        
    def visualize_top_factors(self, output_file="top_factors.png"):
        """Create a simple bar chart of top factors"""
        if not self.results:
            print("No results to visualize")
            return
            
        analysis = self.analyze_results()
        top_factors = analysis["top_factors"]
        
        # Create visualization
        plt.figure(figsize=(10, 6))
        plt.bar(top_factors.keys(), top_factors.values())
        plt.xticks(rotation=45, ha='right')
        plt.title(f"Top Factors in {self.policy_area.replace('_', ' ').title()} Simulations")
        plt.tight_layout()
        plt.savefig(output_file)
        plt.close()
        
        print(f"Visualization saved to {output_file}")


# Example usage for carbon pricing policy
def run_carbon_pricing_simulation():
    simulator = PolicySimulator("carbon_pricing")
    
    # Define parameters for carbon pricing policy
    parameters = {
        "carbon_price": [25, 50, 75],  # $ per ton
        "timeline": [3, 5],  # years
        "revenue_allocation": ["Tax rebates", "Green investments"],
        "sectors_covered": ["All sectors", "Energy and transportation"]
    }
    
    simulator.set_parameters(parameters)
    results = simulator.run_simulation(max_iterations=12)  # Limit iterations for hackathon
    simulator.save_results("carbon_pricing_results.json")
    simulator.save_results_csv("carbon_pricing_results.csv")
    
    analysis = simulator.analyze_results()
    print("Analysis results:", analysis)
    
    simulator.visualize_top_factors()
    
    return simulator, analysis

# Example usage for education funding policy
def run_education_funding_simulation():
    simulator = PolicySimulator("education_funding")
    
    # Define parameters for education funding policy
    parameters = {
        "funding_increase": [5, 10, 15],  # percent
        "allocation_method": ["Per-pupil", "Need-based", "Performance-based"],
        "target_areas": ["Teacher salaries", "Technology", "Facilities"],
        "implementation_period": [2, 4]  # years
    }
    
    simulator.set_parameters(parameters)
    results = simulator.run_simulation(max_iterations=10)
    simulator.save_results("education_funding_results.json")
    simulator.save_results_csv("education_funding_results.csv")
    
    analysis = simulator.analyze_results()
    print("Analysis results:", analysis)
    
    simulator.visualize_top_factors("education_top_factors.png")
    
    return simulator, analysis

# Function to run a single simulation with specific parameters
def run_single_simulation(policy_area, params):
    simulator = PolicySimulator(policy_area)
    prompt = simulator.generate_prompt(params)
    
    print(f"Running single simulation for {policy_area} with parameters: {params}")
    
    try:
        response = simulator.call_claude_api(prompt)
        result_text = response["content"][0]["text"]
        
        # Clean up the JSON response
        if "```json" in result_text:
            result_text = result_text.split("```json")[1].split("```")[0].strip()
        elif "```" in result_text:
            result_text = result_text.split("```")[1].strip()
            
        result_json = json.loads(result_text)
        
        # Print the results nicely formatted
        print("\n=== SIMULATION RESULTS ===")
        print("\nMOST LIKELY SCENARIO:")
        print(result_json["most_likely_scenario"])
        
        print("\nBEST-CASE SCENARIO:")
        print(result_json["best_case_scenario"])
        
        print("\nWORST-CASE SCENARIO:")
        print(result_json["worst_case_scenario"])
        
        print("\nKEY FACTORS:")
        for i, factor in enumerate(result_json["key_factors"], 1):
            print(f"{i}. {factor}")
            
        return result_json
        
    except Exception as e:
        print(f"Error running simulation: {e}")
        return None

# Main function
if __name__ == "__main__":
    # Check if API key is set
    if os.environ.get("ANTHROPIC_API_KEY") is None:
        print("Please set the ANTHROPIC_API_KEY environment variable")
        exit(1)
        
    print("Policy Simulation System")
    print("1. Run Carbon Pricing Simulation")
    print("2. Run Education Funding Simulation")
    print("3. Run Single Carbon Pricing Simulation")
    print("4. Run Single Education Funding Simulation")
    
    choice = input("Enter your choice (1-4): ")
    
    if choice == "1":
        run_carbon_pricing_simulation()
    elif choice == "2":
        run_education_funding_simulation()
    elif choice == "3":
        # Run a single carbon pricing simulation
        params = {
            "carbon_price": int(input("Carbon price ($ per ton): ")),
            "timeline": int(input("Implementation timeline (years): ")),
            "revenue_allocation": input("Revenue allocation: "),
            "sectors_covered": input("Sectors covered: ")
        }
        run_single_simulation("carbon_pricing", params)
    elif choice == "4":
        # Run a single education funding simulation
        params = {
            "funding_increase": int(input("Funding increase (%): ")),
            "allocation_method": input("Allocation method: "),
            "target_areas": input("Target areas: "),
            "implementation_period": int(input("Implementation period (years): "))
        }
        run_single_simulation("education_funding", params)
    else:
        print("Invalid choice")