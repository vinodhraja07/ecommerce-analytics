"""
Seed the database with realistic demo data.
Run: cd backend && python -m app.seed
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from datetime import datetime, timedelta
import random
from app.database import SessionLocal, init_db
from app import models, crud

random.seed(42)

CATEGORIES = ["Electronics", "Fashion", "Home & Furniture", "Beauty", "Sports", "Accessories"]

REGIONS = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad",
    "Pune", "Kolkata", "Ahmedabad", "Jaipur", "Surat",
]

PRODUCTS_DATA = [
    ("iPhone 15 Pro", "Electronics", 134900, 25),
    ("Samsung Galaxy S24", "Electronics", 79999, 18),
    ("Sony WH-1000XM5 Headphones", "Electronics", 24990, 42),
    ("MacBook Air M3", "Electronics", 114900, 12),
    ("iPad Pro 12.9\"", "Electronics", 89900, 20),
    ("OnePlus 12 Smartphone", "Electronics", 64999, 35),
    ("Boat Airdopes 141", "Electronics", 1299, 150),
    ("Noise ColorFit Pro 4", "Electronics", 3499, 80),
    ("Canon EOS R50 Camera", "Electronics", 69990, 8),
    ("JBL Charge 5 Speaker", "Electronics", 13999, 55),
    ("Levi's 511 Slim Jeans", "Fashion", 3999, 200),
    ("Nike Air Max 270", "Fashion", 12995, 90),
    ("Adidas Ultraboost 22", "Fashion", 15999, 60),
    ("H&M Oversized Hoodie", "Fashion", 1799, 300),
    ("Zara Floral Midi Dress", "Fashion", 3990, 110),
    ("Puma Men's T-Shirt Pack", "Fashion", 1499, 250),
    ("Peter England Formal Shirt", "Fashion", 1299, 180),
    ("Allen Solly Chinos", "Fashion", 2799, 130),
    ("Wildcraft Trekking Backpack", "Sports", 2999, 75),
    ("Decathlon Yoga Mat", "Sports", 999, 200),
    ("Cosco Cricket Bat", "Sports", 1599, 95),
    ("Nivia Football", "Sports", 799, 120),
    ("Strauss Resistance Bands", "Sports", 699, 160),
    ("PowerMax Treadmill", "Sports", 34999, 10),
    ("Boldfit Whey Protein 1kg", "Sports", 1499, 85),
    ("IKEA KALLAX Shelf", "Home & Furniture", 12999, 30),
    ("Sleepwell Ortho Mattress", "Home & Furniture", 15999, 22),
    ("Prestige Induction Cooktop", "Home & Furniture", 3499, 65),
    ("Philips Air Fryer", "Home & Furniture", 6999, 48),
    ("Godrej Refrigerator 340L", "Home & Furniture", 34999, 15),
    ("Dyson V12 Vacuum Cleaner", "Home & Furniture", 54900, 7),
    ("Lakme Absolute Foundation", "Beauty", 849, 400),
    ("Maybelline Fit Me Concealer", "Beauty", 399, 500),
    ("Forest Essentials Face Cream", "Beauty", 1795, 85),
    ("The Ordinary Niacinamide", "Beauty", 599, 350),
    ("Mamaearth Vitamin C Serum", "Beauty", 599, 420),
    ("L'Oreal Revitalift Cream", "Beauty", 1199, 200),
    ("Fastrack Analog Watch", "Accessories", 1995, 180),
    ("Titan Edge Slim Watch", "Accessories", 8995, 65),
    ("Fossil Gen 6 Smartwatch", "Accessories", 24999, 40),
    ("Baggit Women's Handbag", "Accessories", 2499, 120),
    ("Safari Polycarbonate Trolley", "Accessories", 5999, 55),
    ("Ray-Ban Wayfarer Sunglasses", "Accessories", 7490, 70),
]

FIRST_NAMES = [
    "Aarav", "Vivaan", "Aditya", "Vihaan", "Arjun", "Sai", "Reyansh", "Kabir",
    "Krishn", "Ishaan", "Ananya", "Diya", "Saanvi", "Myra", "Sara", "Anika",
    "Priya", "Rohit", "Sneha", "Rahul", "Pooja", "Amit", "Neha", "Vikram",
    "Deepa", "Suresh", "Meera", "Rajesh", "Kavita", "Sanjay", "Lakshmi",
    "Harish", "Divya", "Manish", "Sunita", "Prakash", "Geeta", "Ramesh",
    "Usha", "Sunil", "Rekha", "Ajay", "Shweta", "Manoj", "Nisha", "Vijay",
    "Asha", "Ravi", "Seema", "Arun", "Madhuri",
]

LAST_NAMES = [
    "Sharma", "Verma", "Patel", "Singh", "Kumar", "Gupta", "Joshi", "Mehta",
    "Nair", "Reddy", "Iyer", "Rao", "Pillai", "Bose", "Sen", "Das",
    "Chatterjee", "Mukherjee", "Agarwal", "Bansal", "Chopra", "Khanna",
    "Malhotra", "Kapoor", "Bhatia", "Arora", "Chadha", "Walia", "Sood",
    "Gill", "Sandhu", "Dhaliwal", "Bajwa", "Sidhu",
]


def make_customers(db, n=55):
    print(f"Creating {n} customers...")
    used_emails = set()
    customers = []
    for i in range(n):
        first = random.choice(FIRST_NAMES)
        last = random.choice(LAST_NAMES)
        name = f"{first} {last}"
        base_email = f"{first.lower()}.{last.lower()}{i}@example.com"
        while base_email in used_emails:
            base_email = f"{first.lower()}.{last.lower()}{i}{random.randint(10,99)}@example.com"
        used_emails.add(base_email)
        phone = f"+91 {random.randint(70000,99999)}{random.randint(10000,99999)}"
        location = random.choice(REGIONS)
        days_ago = random.randint(30, 730)
        created = datetime.utcnow() - timedelta(days=days_ago)
        c = models.Customer(name=name, email=base_email, phone=phone, location=location, created_at=created)
        db.add(c)
        customers.append(c)
    db.flush()
    return customers


def make_products(db):
    print(f"Creating {len(PRODUCTS_DATA)} products...")
    products = []
    for name, cat, price, stock in PRODUCTS_DATA:
        # Give some products low/zero stock for inventory alerts
        if random.random() < 0.08:
            stock = 0
        elif random.random() < 0.15:
            stock = random.randint(1, 10)
        p = models.Product(name=name, category=cat, price=price, stock=stock)
        db.add(p)
        products.append(p)
    db.flush()
    return products


def make_sales(db, customers, products, n=300):
    print(f"Creating {n} sales records...")
    order_counter = 10001
    now = datetime.utcnow()

    for _ in range(n):
        days_ago = random.randint(0, 365)
        # Weight recent dates more heavily
        if random.random() < 0.4:
            days_ago = random.randint(0, 30)
        elif random.random() < 0.3:
            days_ago = random.randint(30, 90)

        sale_date = now - timedelta(days=days_ago, hours=random.randint(0, 23), minutes=random.randint(0, 59))
        product = random.choice(products)
        customer = random.choice(customers)
        quantity = random.choices([1, 2, 3, 4, 5], weights=[50, 25, 12, 8, 5])[0]
        # Small price variation ±5%
        price_var = product.price * random.uniform(0.95, 1.05)
        price = round(price_var, 2)

        order_id = f"ORD-{order_counter:05d}"
        order_counter += 1

        s = models.Sale(
            order_id=order_id,
            customer_id=customer.id,
            product_id=product.id,
            date=sale_date,
            quantity=quantity,
            price=price,
            category=product.category,
            region=customer.location,
        )
        db.add(s)

    db.flush()


def seed():
    print("Initializing database...")
    init_db()
    db = SessionLocal()
    try:
        # Check if already seeded
        existing = db.query(models.User).first()
        if existing:
            print("Database already seeded. Skipping.")
            return

        # Demo user
        print("Creating demo admin user...")
        crud.create_user(db, name="Admin User", email="admin@demo.com", password="admin123", role="admin")

        # Default settings
        from app.crud import upsert_setting
        upsert_setting(db, "store_name", "ShopMetrics Pro")
        upsert_setting(db, "revenue_goal", "1000000")
        upsert_setting(db, "currency", "INR")

        customers = make_customers(db)
        products = make_products(db)
        make_sales(db, customers, products, n=300)

        db.commit()
        print("[OK] Seed complete!")
        print("   Demo credentials:")
        print("   Email:    admin@demo.com")
        print("   Password: admin123")
    except Exception as e:
        db.rollback()
        print(f"[FAIL] Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
