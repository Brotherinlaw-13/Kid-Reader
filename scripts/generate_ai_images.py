#!/usr/bin/env python3
"""
Professional AI Image Generation for Kid Reader
Integrates with high-quality AI services to generate beautiful children's book illustrations
"""

import os
import requests
import json
import time
from pathlib import Path
from typing import Dict, List, Optional
import base64

class AIImageGenerator:
    def __init__(self):
        self.output_dir = Path("public/images/stories/magic-wand")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    def generate_with_replicate(self, prompt: str, filename: str, api_key: str) -> bool:
        """Generate image using Replicate API (hosts Midjourney-style models)"""
        try:
            import replicate
            
            # Use SDXL or Midjourney-style model
            model = "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b"
            
            output = replicate.run(
                model,
                input={
                    "prompt": prompt,
                    "width": 800,
                    "height": 600,
                    "num_outputs": 1,
                    "scheduler": "K_EULER",
                    "num_inference_steps": 50,
                    "guidance_scale": 7.5,
                    "prompt_strength": 0.8,
                }
            )
            
            if output and len(output) > 0:
                image_url = output[0]
                return self._download_image(image_url, filename)
                
        except Exception as e:
            print(f"❌ Replicate error: {e}")
            return False
    
    def generate_with_openai(self, prompt: str, filename: str, api_key: str) -> bool:
        """Generate image using OpenAI DALL-E 3"""
        try:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "dall-e-3",
                "prompt": prompt,
                "n": 1,
                "size": "1024x1024",
                "quality": "hd",
                "style": "vivid"
            }
            
            response = requests.post(
                "https://api.openai.com/v1/images/generations",
                headers=headers,
                json=data
            )
            
            if response.status_code == 200:
                result = response.json()
                image_url = result['data'][0]['url']
                return self._download_image(image_url, filename)
                
        except Exception as e:
            print(f"❌ OpenAI error: {e}")
            return False
    
    def generate_with_stability(self, prompt: str, filename: str, api_key: str) -> bool:
        """Generate image using Stability AI (Stable Diffusion)"""
        try:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            data = {
                "text_prompts": [{"text": prompt}],
                "cfg_scale": 7,
                "height": 600,
                "width": 800,
                "samples": 1,
                "steps": 50,
                "style_preset": "fantasy-art"
            }
            
            response = requests.post(
                "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
                headers=headers,
                json=data
            )
            
            if response.status_code == 200:
                result = response.json()
                image_data = result['artifacts'][0]['base64']
                return self._save_base64_image(image_data, filename)
                
        except Exception as e:
            print(f"❌ Stability AI error: {e}")
            return False
    
    def generate_with_leonardo(self, prompt: str, filename: str, api_key: str) -> bool:
        """Generate image using Leonardo.AI"""
        try:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            # First, create generation
            data = {
                "prompt": prompt,
                "modelId": "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3",  # Leonardo Creative model
                "width": 800,
                "height": 600,
                "num_images": 1,
                "guidance_scale": 7,
                "num_inference_steps": 50,
                "presetStyle": "ILLUSTRATION"
            }
            
            response = requests.post(
                "https://cloud.leonardo.ai/api/rest/v1/generations",
                headers=headers,
                json=data
            )
            
            if response.status_code == 200:
                generation_id = response.json()['sdGenerationJob']['generationId']
                
                # Poll for completion
                for _ in range(30):  # Wait up to 5 minutes
                    time.sleep(10)
                    status_response = requests.get(
                        f"https://cloud.leonardo.ai/api/rest/v1/generations/{generation_id}",
                        headers=headers
                    )
                    
                    if status_response.status_code == 200:
                        status_data = status_response.json()
                        if status_data['generations_by_pk']['status'] == 'COMPLETE':
                            image_url = status_data['generations_by_pk']['generated_images'][0]['url']
                            return self._download_image(image_url, filename)
                
        except Exception as e:
            print(f"❌ Leonardo AI error: {e}")
            return False
    
    def _download_image(self, url: str, filename: str) -> bool:
        """Download image from URL"""
        try:
            response = requests.get(url)
            if response.status_code == 200:
                filepath = self.output_dir / filename
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                print(f"✅ Downloaded: {filepath}")
                return True
        except Exception as e:
            print(f"❌ Download error: {e}")
        return False
    
    def _save_base64_image(self, base64_data: str, filename: str) -> bool:
        """Save base64 encoded image"""
        try:
            image_data = base64.b64decode(base64_data)
            filepath = self.output_dir / filename
            with open(filepath, 'wb') as f:
                f.write(image_data)
            print(f"✅ Saved: {filepath}")
            return True
        except Exception as e:
            print(f"❌ Save error: {e}")
        return False

def get_enhanced_prompts() -> Dict[str, str]:
    """Get enhanced prompts for professional children's book illustrations"""
    return {
        "cover.jpg": """
        Professional children's book cover illustration, a young wizard child with a pointed purple hat and friendly smile, holding a glowing magic wand with sparkles, standing in an enchanted forest clearing with magical flowers and butterflies, warm golden lighting, whimsical fantasy art style, digital painting, highly detailed, vibrant colors, suitable for ages 4-8, storybook illustration, magical atmosphere
        """.strip(),
        
        "page1.jpg": """
        Children's book illustration, cute young wizard with purple pointed hat and robes, friendly expression, standing in a cozy magical cottage interior with spell books and candles, warm lighting, soft watercolor style, whimsical and inviting, professional children's book art, detailed but simple, bright cheerful colors
        """.strip(),
        
        "page2.jpg": """
        Children's book illustration, young wizard waving a magical wand in the air, beautiful sparkles and golden stars flowing from the wand tip, magical energy swirling around, outdoor garden setting, dynamic pose, whimsical art style, bright vibrant colors, professional storybook illustration, magical atmosphere, child-friendly
        """.strip(),
        
        "page3.jpg": """
        Children's book illustration, magical garden scene with colorful flowers blooming everywhere - roses, daisies, tulips, sunflowers in bright reds, yellows, pinks, and purples, young wizard in background looking amazed, butterflies and sparkles in the air, beautiful magical garden, whimsical art style, professional children's book illustration, joyful and colorful
        """.strip()
    }

def main():
    """Main function to generate all images"""
    generator = AIImageGenerator()
    prompts = get_enhanced_prompts()
    
    print("🎨 Professional AI Image Generation for Kid Reader")
    print("=" * 60)
    
    # Check for API keys
    api_keys = {
        'openai': os.getenv('OPENAI_API_KEY'),
        'replicate': os.getenv('REPLICATE_API_TOKEN'),
        'stability': os.getenv('STABILITY_API_KEY'),
        'leonardo': os.getenv('LEONARDO_API_KEY')
    }
    
    available_services = [k for k, v in api_keys.items() if v]
    
    if not available_services:
        print("❌ No API keys found!")
        print("\nTo use this script, set one or more environment variables:")
        print("  export OPENAI_API_KEY='your-key-here'")
        print("  export REPLICATE_API_TOKEN='your-token-here'")
        print("  export STABILITY_API_KEY='your-key-here'")
        print("  export LEONARDO_API_KEY='your-key-here'")
        print("\nAlternatively, use the manual generation guide:")
        print("  See AI_IMAGE_GENERATION_GUIDE.md")
        return
    
    print(f"✅ Available services: {', '.join(available_services)}")
    print()
    
    # Generate images
    for filename, prompt in prompts.items():
        print(f"🎨 Generating {filename}...")
        print(f"📝 Prompt: {prompt[:100]}...")
        
        success = False
        
        # Try services in order of preference
        if 'openai' in available_services:
            success = generator.generate_with_openai(prompt, filename, api_keys['openai'])
        elif 'replicate' in available_services:
            success = generator.generate_with_replicate(prompt, filename, api_keys['replicate'])
        elif 'stability' in available_services:
            success = generator.generate_with_stability(prompt, filename, api_keys['stability'])
        elif 'leonardo' in available_services:
            success = generator.generate_with_leonardo(prompt, filename, api_keys['leonardo'])
        
        if success:
            print(f"✅ Successfully generated {filename}")
        else:
            print(f"❌ Failed to generate {filename}")
        
        print("-" * 40)
        time.sleep(2)  # Rate limiting
    
    print("🎉 Image generation complete!")
    print(f"📁 Check your images in: {generator.output_dir}")

if __name__ == "__main__":
    main() 